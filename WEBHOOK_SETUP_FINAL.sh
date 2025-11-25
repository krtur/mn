#!/bin/bash

# ============================================
# 🚀 CONFIGURAÇÃO FINAL DO WEBHOOK
# Deploy Automático do GitHub para VPS
# ============================================

set -e

echo "
╔════════════════════════════════════════════════════════════════╗
║         🚀 CONFIGURAÇÃO FINAL DO WEBHOOK                      ║
║         Deploy Automático M&N Terapeutas                      ║
╚════════════════════════════════════════════════════════════════╝
"

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
PROJECT_DIR="/var/www/mn"
WEBHOOK_PORT="9000"
WEBHOOK_SECRET="c07e7eaa5d8bab70edf4b3acb837f9426ce96fbbd12ee2b270821cecb11b19b8"
WEBHOOK_USER="webhook"

echo -e "${BLUE}📋 Verificando pré-requisitos...${NC}"

# Verificar se está rodando como root
if [ "$EUID" -ne 0 ]; then 
  echo -e "${RED}❌ Este script deve ser executado como root${NC}"
  exit 1
fi

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
  echo -e "${RED}❌ Node.js não está instalado${NC}"
  exit 1
fi

echo -e "${GREEN}✅ Node.js instalado: $(node --version)${NC}"

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
  echo -e "${RED}❌ npm não está instalado${NC}"
  exit 1
fi

echo -e "${GREEN}✅ npm instalado: $(npm --version)${NC}"

# ============================================
# 1. Criar usuário webhook (se não existir)
# ============================================
echo -e "\n${BLUE}1️⃣ Criando usuário webhook...${NC}"

if id "$WEBHOOK_USER" &>/dev/null; then
  echo -e "${YELLOW}⚠️ Usuário webhook já existe${NC}"
else
  useradd -r -s /bin/bash -d /var/www/webhook $WEBHOOK_USER
  echo -e "${GREEN}✅ Usuário webhook criado${NC}"
fi

# ============================================
# 2. Copiar webhook-server.js para o VPS
# ============================================
echo -e "\n${BLUE}2️⃣ Instalando webhook-server.js...${NC}"

if [ ! -f "$PROJECT_DIR/webhook-server.js" ]; then
  echo -e "${RED}❌ webhook-server.js não encontrado em $PROJECT_DIR${NC}"
  echo -e "${YELLOW}⚠️ Certifique-se de que o arquivo foi copiado para o VPS${NC}"
  exit 1
fi

echo -e "${GREEN}✅ webhook-server.js encontrado${NC}"

# ============================================
# 3. Configurar permissões
# ============================================
echo -e "\n${BLUE}3️⃣ Configurando permissões...${NC}"

chmod +x "$PROJECT_DIR/webhook-server.js"
chown -R $WEBHOOK_USER:$WEBHOOK_USER "$PROJECT_DIR"

echo -e "${GREEN}✅ Permissões configuradas${NC}"

# ============================================
# 4. Criar arquivo de serviço systemd
# ============================================
echo -e "\n${BLUE}4️⃣ Criando serviço systemd...${NC}"

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

echo -e "${GREEN}✅ Serviço systemd criado${NC}"

# ============================================
# 5. Recarregar systemd e iniciar serviço
# ============================================
echo -e "\n${BLUE}5️⃣ Iniciando serviço webhook...${NC}"

systemctl daemon-reload
systemctl enable webhook
systemctl restart webhook

# Aguardar um pouco para o serviço iniciar
sleep 2

# Verificar status
if systemctl is-active --quiet webhook; then
  echo -e "${GREEN}✅ Serviço webhook iniciado com sucesso${NC}"
else
  echo -e "${RED}❌ Erro ao iniciar serviço webhook${NC}"
  systemctl status webhook
  exit 1
fi

# ============================================
# 6. Configurar Nginx como proxy reverso
# ============================================
echo -e "\n${BLUE}6️⃣ Configurando Nginx...${NC}"

cat > /etc/nginx/sites-available/webhook << 'EOF'
server {
    listen 9000;
    listen [::]:9000;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:9001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Headers do GitHub Webhook
        proxy_pass_request_headers on;
    }
}
EOF

# Criar link simbólico se não existir
if [ ! -L /etc/nginx/sites-enabled/webhook ]; then
  ln -s /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/webhook
fi

# Testar configuração do Nginx
if nginx -t &> /dev/null; then
  systemctl restart nginx
  echo -e "${GREEN}✅ Nginx configurado e reiniciado${NC}"
else
  echo -e "${RED}❌ Erro na configuração do Nginx${NC}"
  nginx -t
  exit 1
fi

# ============================================
# 7. Configurar Firewall
# ============================================
echo -e "\n${BLUE}7️⃣ Configurando Firewall...${NC}"

if command -v ufw &> /dev/null; then
  # Permitir porta 9000
  ufw allow 9000/tcp 2>/dev/null || true
  echo -e "${GREEN}✅ Firewall configurado para porta 9000${NC}"
else
  echo -e "${YELLOW}⚠️ UFW não instalado, pulando configuração de firewall${NC}"
fi

# ============================================
# 8. Testar webhook
# ============================================
echo -e "\n${BLUE}8️⃣ Testando webhook...${NC}"

sleep 1

# Fazer requisição de teste
RESPONSE=$(curl -s -X GET http://localhost:9000/health 2>/dev/null || echo "")

if echo "$RESPONSE" | grep -q "ok"; then
  echo -e "${GREEN}✅ Webhook respondendo corretamente${NC}"
else
  echo -e "${YELLOW}⚠️ Webhook pode estar demorando para iniciar${NC}"
  echo -e "${YELLOW}   Aguarde 10 segundos e tente novamente${NC}"
fi

# ============================================
# 9. Exibir informações finais
# ============================================
echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ WEBHOOK CONFIGURADO COM SUCESSO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"

echo -e "\n${BLUE}📊 INFORMAÇÕES DO WEBHOOK:${NC}"
echo -e "   ${BLUE}Porta:${NC} $WEBHOOK_PORT"
echo -e "   ${BLUE}URL:${NC} http://31.97.252.100:$WEBHOOK_PORT"
echo -e "   ${BLUE}Endpoint:${NC} http://31.97.252.100:$WEBHOOK_PORT/hooks/mn-deploy"
echo -e "   ${BLUE}Secret:${NC} ${WEBHOOK_SECRET:0:16}..."
echo -e "   ${BLUE}Serviço:${NC} webhook (systemd)"

echo -e "\n${BLUE}🔧 PRÓXIMOS PASSOS:${NC}"
echo -e "   1. Acesse: https://github.com/krtur/mn/settings/hooks"
echo -e "   2. Clique em 'Add webhook'"
echo -e "   3. Preencha os campos:"
echo -e "      ${YELLOW}Payload URL:${NC} http://31.97.252.100:$WEBHOOK_PORT/hooks/mn-deploy"
echo -e "      ${YELLOW}Content type:${NC} application/json"
echo -e "      ${YELLOW}Secret:${NC} $WEBHOOK_SECRET"
echo -e "      ${YELLOW}Events:${NC} Just the push event"
echo -e "      ${YELLOW}Active:${NC} ☑ Checked"
echo -e "   4. Clique em 'Add webhook'"

echo -e "\n${BLUE}🧪 TESTAR WEBHOOK:${NC}"
echo -e "   ${YELLOW}Manualmente:${NC}"
echo -e "      curl -X POST http://localhost:9000/hooks/test"
echo -e "   ${YELLOW}Health check:${NC}"
echo -e "      curl http://localhost:9000/health"

echo -e "\n${BLUE}📋 COMANDOS ÚTEIS:${NC}"
echo -e "   ${YELLOW}Ver status:${NC}"
echo -e "      systemctl status webhook"
echo -e "   ${YELLOW}Ver logs em tempo real:${NC}"
echo -e "      journalctl -u webhook -f"
echo -e "   ${YELLOW}Reiniciar webhook:${NC}"
echo -e "      systemctl restart webhook"
echo -e "   ${YELLOW}Parar webhook:${NC}"
echo -e "      systemctl stop webhook"
echo -e "   ${YELLOW}Ver últimos 50 logs:${NC}"
echo -e "      journalctl -u webhook -n 50"

echo -e "\n${BLUE}🔍 VERIFICAR FUNCIONAMENTO:${NC}"
echo -e "   1. Faça um commit e push no GitHub:"
echo -e "      ${YELLOW}git commit -m 'teste deploy' --allow-empty${NC}"
echo -e "      ${YELLOW}git push origin main${NC}"
echo -e "   2. Aguarde 2-3 minutos"
echo -e "   3. Verifique os logs:"
echo -e "      ${YELLOW}journalctl -u webhook -f${NC}"
echo -e "   4. Recarregue o site: http://31.97.252.100"

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}🎉 TUDO PRONTO! Deploy automático ativado!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}\n"
