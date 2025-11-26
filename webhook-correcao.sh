#!/bin/bash

# ============================================
# 🔧 CORREÇÃO DO WEBHOOK E DEPLOY AUTOMÁTICO
# M&N Terapeutas - VPS
# ============================================

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "
╔════════════════════════════════════════════════════════════════╗
║         🔧 CORREÇÃO DE DEPLOY AUTOMÁTICO                      ║
║         M&N Terapeutas - VPS                                  ║
╚════════════════════════════════════════════════════════════════╝
"

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Este script deve ser executado como root${NC}"
  exit 1
fi

# Configurações
PROJECT_DIR="/var/www/mn"
WEBHOOK_PORT="9001"
NGINX_PORT="9000"
WEBHOOK_SECRET="c07e7eaa5d8bab70edf4b3acb837f9426ce96fbbd12ee2b270821cecb11b19b8"
WEBHOOK_USER="root"
LOG_FILE="/tmp/webhook-correcao.log"

# Limpar log anterior
> $LOG_FILE

# Função para registrar no log
log() {
  echo "$1" >> $LOG_FILE
  echo -e "$1"
}

# ============================================
# 1. Parar serviços existentes
# ============================================
echo -e "\n${BLUE}1️⃣ Parando serviços existentes...${NC}"

systemctl stop webhook 2>/dev/null || true
log "${GREEN}✅ Serviço webhook parado${NC}"

# ============================================
# 2. Verificar e instalar dependências
# ============================================
echo -e "\n${BLUE}2️⃣ Verificando dependências...${NC}"

# Verificar Node.js
if ! command -v node &> /dev/null; then
  log "${YELLOW}⚠️ Node.js não encontrado, instalando...${NC}"
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  log "${GREEN}✅ Node.js já instalado: $(node --version)${NC}"
fi

# ============================================
# 3. Criar/atualizar webhook-server.js
# ============================================
echo -e "\n${BLUE}3️⃣ Criando webhook-server.js...${NC}"

cat > "$PROJECT_DIR/webhook-server.js" << 'EOF'
#!/usr/bin/env node

/**
 * Servidor Webhook para Deploy Automático
 * Recebe notificações do GitHub e executa o deploy
 */

const express = require('express');
const crypto = require('crypto');
const { exec } = require('child_process');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');

const execAsync = promisify(exec);

const app = express();
const PORT = process.env.WEBHOOK_PORT || 9001;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET || 'c07e7eaa5d8bab70edf4b3acb837f9426ce96fbbd12ee2b270821cecb11b19b8';
const PROJECT_DIR = process.env.PROJECT_DIR || '/var/www/mn';

// Middleware
app.use(express.json());

// Log de requisições
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

/**
 * Verifica a assinatura do webhook
 */
function verifyWebhookSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  
  if (!signature) {
    console.warn('⚠️ Webhook sem assinatura detectado');
    return false;
  }

  const payload = JSON.stringify(req.body);
  const hash = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  const expectedSignature = `sha256=${hash}`;
  
  return signature === expectedSignature;
}

/**
 * Executa o deploy
 */
async function executeDeploy() {
  try {
    console.log('\n========================================');
    console.log('🚀 INICIANDO DEPLOY AUTOMÁTICO');
    console.log('========================================\n');

    // 1. Navegar para o diretório do projeto
    console.log(`📁 Entrando no diretório: ${PROJECT_DIR}`);
    
    // 2. Pull das alterações
    console.log('📥 Fazendo git pull origin main...');
    const { stdout: pullOutput } = await execAsync('git pull origin main', { cwd: PROJECT_DIR });
    console.log(pullOutput);

    // 3. Instalar dependências
    console.log('📦 Instalando dependências com npm install...');
    const { stdout: npmOutput } = await execAsync('npm install', { cwd: PROJECT_DIR });
    console.log(npmOutput);

    // 4. Build do frontend
    console.log('🔨 Fazendo build do frontend com npm run build...');
    const { stdout: buildOutput } = await execAsync('npm run build', { cwd: PROJECT_DIR });
    console.log(buildOutput);

    // 5. Reiniciar o servidor com PM2
    console.log('🔄 Reiniciando servidor com PM2...');
    try {
      await execAsync('pm2 restart mn-backend', { cwd: PROJECT_DIR });
      console.log('✅ Servidor reiniciado com sucesso');
    } catch (pmError) {
      console.log('⚠️ PM2 restart falhou, tentando start...');
      await execAsync('pm2 start server.js --name mn-backend', { cwd: PROJECT_DIR });
      console.log('✅ Servidor iniciado com sucesso');
    }

    // 6. Salvar configuração do PM2
    console.log('💾 Salvando configuração do PM2...');
    await execAsync('pm2 save', { cwd: PROJECT_DIR });

    // 7. Reiniciar Nginx
    console.log('🔄 Reiniciando Nginx...');
    await execAsync('systemctl restart nginx');
    console.log('✅ Nginx reiniciado com sucesso');

    console.log('\n========================================');
    console.log('✅ DEPLOY CONCLUÍDO COM SUCESSO!');
    console.log('========================================\n');
    console.log('🌐 Site: http://31.97.252.100');
    console.log('🔌 API: http://31.97.252.100:3001/api\n');

    return { success: true, message: 'Deploy concluído com sucesso' };
  } catch (error) {
    console.error('\n========================================');
    console.error('❌ ERRO NO DEPLOY!');
    console.error('========================================\n');
    console.error('Erro:', error.message);
    console.error('Stdout:', error.stdout);
    console.error('Stderr:', error.stderr);
    console.error('\n');
    
    return { 
      success: false, 
      message: 'Erro ao executar deploy',
      error: error.message 
    };
  }
}

/**
 * Rota para receber webhooks do GitHub
 */
app.post('/hooks/mn-deploy', async (req, res) => {
  console.log('\n📨 Webhook recebido do GitHub');
  
  // Verificar assinatura
  try {
    const isValid = verifyWebhookSignature(req);
    
    if (!isValid) {
      console.error('❌ Assinatura do webhook inválida!');
      return res.status(401).json({ error: 'Assinatura inválida' });
    }
    
    console.log('✅ Assinatura do webhook verificada');
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error.message);
    return res.status(401).json({ error: 'Erro ao verificar assinatura' });
  }

  // Verificar se é um push event
  const event = req.headers['x-github-event'];
  if (event !== 'push') {
    console.log(`⏭️ Evento ignorado: ${event} (esperado: push)`);
    return res.status(200).json({ message: 'Evento ignorado (não é push)' });
  }

  // Verificar branch
  const branch = req.body.ref?.split('/').pop();
  if (branch !== 'main') {
    console.log(`⏭️ Branch ignorado: ${branch} (esperado: main)`);
    return res.status(200).json({ message: `Branch ignorado (${branch})` });
  }

  console.log('✅ Push na branch main detectado');
  console.log(`📝 Commits: ${req.body.commits?.length || 0}`);
  
  if (req.body.commits && req.body.commits.length > 0) {
    req.body.commits.forEach((commit, index) => {
      console.log(`   ${index + 1}. ${commit.message}`);
    });
  }

  // Executar deploy
  const result = await executeDeploy();
  
  // Responder ao GitHub
  res.status(result.success ? 200 : 500).json(result);
});

/**
 * Rota para teste do webhook
 */
app.post('/hooks/test', async (req, res) => {
  console.log('\n🧪 Teste de webhook recebido');
  const result = await executeDeploy();
  res.status(result.success ? 200 : 500).json(result);
});

/**
 * Rota de health check
 */
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Rota raiz
 */
app.get('/', (req, res) => {
  res.json({
    name: 'M&N Terapeutas - Webhook Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      webhook: 'POST /hooks/mn-deploy',
      test: 'POST /hooks/test',
      health: 'GET /health'
    }
  });
});

/**
 * Tratamento de erros
 */
app.use((err, req, res, next) => {
  console.error('❌ Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno do servidor' });
});

/**
 * Iniciar servidor
 */
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════════════════════════╗
║         🚀 WEBHOOK SERVER - M&N TERAPEUTAS                    ║
╚════════════════════════════════════════════════════════════════╝

✅ Servidor rodando na porta ${PORT}
📍 URL: http://0.0.0.0:${PORT}

📨 Endpoints:
   - POST /hooks/mn-deploy    → Webhook do GitHub
   - POST /hooks/test         → Teste manual de deploy
   - GET  /health             → Health check
   - GET  /                   → Info do servidor

🔐 Webhook Secret: ${WEBHOOK_SECRET.substring(0, 16)}...
📁 Projeto: ${PROJECT_DIR}

⚙️ Configuração do GitHub Webhook:
   URL: http://31.97.252.100:${NGINX_PORT}/hooks/mn-deploy
   Content-type: application/json
   Events: Push events
   Secret: ${WEBHOOK_SECRET}

🧪 Testar deploy manualmente:
   curl -X POST http://localhost:${PORT}/hooks/test

📊 Ver logs:
   journalctl -u webhook -f

════════════════════════════════════════════════════════════════
  `);
});

// Tratamento de sinais
process.on('SIGTERM', () => {
  console.log('\n📛 SIGTERM recebido, encerrando...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n📛 SIGINT recebido, encerrando...');
  process.exit(0);
});
EOF

chmod +x "$PROJECT_DIR/webhook-server.js"
log "${GREEN}✅ webhook-server.js criado e configurado${NC}"

# ============================================
# 4. Instalar dependências do Node.js
# ============================================
echo -e "\n${BLUE}4️⃣ Instalando dependências do Node.js...${NC}"

cd "$PROJECT_DIR"
npm install express crypto child_process util fs path

log "${GREEN}✅ Dependências instaladas${NC}"

# ============================================
# 5. Configurar serviço systemd
# ============================================
echo -e "\n${BLUE}5️⃣ Configurando serviço systemd...${NC}"

cat > /etc/systemd/system/webhook.service << EOF
[Unit]
Description=M&N Terapeutas - Webhook Server
After=network.target

[Service]
Type=simple
User=$WEBHOOK_USER
WorkingDirectory=$PROJECT_DIR
ExecStart=/usr/bin/node $PROJECT_DIR/webhook-server.js
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal
Environment="NODE_ENV=production"
Environment="WEBHOOK_PORT=$WEBHOOK_PORT"
Environment="WEBHOOK_SECRET=$WEBHOOK_SECRET"
Environment="PROJECT_DIR=$PROJECT_DIR"

[Install]
WantedBy=multi-user.target
EOF

log "${GREEN}✅ Serviço systemd configurado${NC}"

# ============================================
# 6. Configurar Nginx como proxy reverso
# ============================================
echo -e "\n${BLUE}6️⃣ Configurando Nginx...${NC}"

cat > /etc/nginx/sites-available/webhook << EOF
server {
    listen $NGINX_PORT;
    listen [::]:$NGINX_PORT;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:$WEBHOOK_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Headers do GitHub Webhook
        proxy_pass_request_headers on;
    }
}
EOF

# Criar link simbólico se não existir
if [ ! -L /etc/nginx/sites-enabled/webhook ]; then
  ln -s /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/webhook
fi

log "${GREEN}✅ Nginx configurado${NC}"

# ============================================
# 7. Configurar Firewall
# ============================================
echo -e "\n${BLUE}7️⃣ Configurando Firewall...${NC}"

if command -v ufw &> /dev/null; then
  # Permitir porta do Nginx
  ufw allow $NGINX_PORT/tcp 2>/dev/null || true
  log "${GREEN}✅ Firewall configurado para porta $NGINX_PORT${NC}"
else
  log "${YELLOW}⚠️ UFW não instalado, pulando configuração de firewall${NC}"
fi

# ============================================
# 8. Iniciar e habilitar serviços
# ============================================
echo -e "\n${BLUE}8️⃣ Iniciando serviços...${NC}"

# Recarregar systemd
systemctl daemon-reload

# Habilitar e iniciar webhook
systemctl enable webhook
systemctl restart webhook

# Verificar status
if systemctl is-active --quiet webhook; then
  log "${GREEN}✅ Serviço webhook iniciado com sucesso${NC}"
else
  log "${RED}❌ Erro ao iniciar serviço webhook${NC}"
  systemctl status webhook >> $LOG_FILE
fi

# Reiniciar Nginx
if nginx -t &> /dev/null; then
  systemctl restart nginx
  log "${GREEN}✅ Nginx reiniciado com sucesso${NC}"
else
  log "${RED}❌ Erro na configuração do Nginx${NC}"
  nginx -t >> $LOG_FILE
fi

# ============================================
# 9. Criar script de teste
# ============================================
echo -e "\n${BLUE}9️⃣ Criando script de teste...${NC}"

cat > "$PROJECT_DIR/test-webhook.sh" << EOF
#!/bin/bash

echo "🧪 Testando webhook..."
curl -X POST http://localhost:$WEBHOOK_PORT/hooks/test

echo ""
echo "🔍 Verificando status..."
curl http://localhost:$WEBHOOK_PORT/health
EOF

chmod +x "$PROJECT_DIR/test-webhook.sh"
log "${GREEN}✅ Script de teste criado${NC}"

# ============================================
# 10. Configurar cron para verificação periódica
# ============================================
echo -e "\n${BLUE}🔟 Configurando verificação periódica...${NC}"

# Criar script de verificação
cat > "$PROJECT_DIR/check-webhook.sh" << 'EOF'
#!/bin/bash

# Verificar se o serviço webhook está rodando
if ! systemctl is-active --quiet webhook; then
  echo "[$(date)] Webhook não está rodando, reiniciando..." >> /var/log/webhook-check.log
  systemctl restart webhook
fi

# Verificar se o serviço está respondendo
if ! curl -s http://localhost:9001/health | grep -q "ok"; then
  echo "[$(date)] Webhook não está respondendo, reiniciando..." >> /var/log/webhook-check.log
  systemctl restart webhook
fi
EOF

chmod +x "$PROJECT_DIR/check-webhook.sh"

# Adicionar ao crontab
(crontab -l 2>/dev/null || echo "") | grep -v "check-webhook.sh" | { cat; echo "*/5 * * * * $PROJECT_DIR/check-webhook.sh"; } | crontab -

log "${GREEN}✅ Verificação periódica configurada${NC}"

# ============================================
# Resumo
# ============================================
echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ CORREÇÃO CONCLUÍDA COM SUCESSO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}📊 INFORMAÇÕES DO WEBHOOK:${NC}"
echo -e "   ${BLUE}Porta interna:${NC} $WEBHOOK_PORT"
echo -e "   ${BLUE}Porta Nginx:${NC} $NGINX_PORT"
echo -e "   ${BLUE}URL:${NC} http://31.97.252.100:$NGINX_PORT"
echo -e "   ${BLUE}Endpoint:${NC} http://31.97.252.100:$NGINX_PORT/hooks/mn-deploy"
echo -e "   ${BLUE}Secret:${NC} ${WEBHOOK_SECRET:0:16}..."

echo -e "\n${BLUE}🧪 TESTAR WEBHOOK:${NC}"
echo -e "   ${YELLOW}Execute:${NC}"
echo -e "      $PROJECT_DIR/test-webhook.sh"
echo -e "   ${YELLOW}Ou:${NC}"
echo -e "      curl -X POST http://localhost:$WEBHOOK_PORT/hooks/test"

echo -e "\n${BLUE}📋 COMANDOS ÚTEIS:${NC}"
echo -e "   ${YELLOW}Ver status:${NC}"
echo -e "      systemctl status webhook"
echo -e "   ${YELLOW}Ver logs:${NC}"
echo -e "      journalctl -u webhook -f"
echo -e "   ${YELLOW}Reiniciar:${NC}"
echo -e "      systemctl restart webhook"

echo -e "\n${BLUE}🔍 VERIFICAR FUNCIONAMENTO:${NC}"
echo -e "   1. Faça um commit e push no GitHub:"
echo -e "      ${YELLOW}git commit -m 'teste webhook' --allow-empty${NC}"
echo -e "      ${YELLOW}git push origin main${NC}"
echo -e "   2. Aguarde 2-3 minutos"
echo -e "   3. Verifique os logs:"
echo -e "      ${YELLOW}journalctl -u webhook -f${NC}"

echo -e "\n${BLUE}📋 Log completo salvo em: ${NC}$LOG_FILE"
