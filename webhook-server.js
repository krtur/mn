#!/usr/bin/env node

/**
 * Servidor Webhook para Deploy Automático
 * Recebe notificações do GitHub e executa o deploy
 */

import express from 'express';
import crypto from 'crypto';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.WEBHOOK_PORT || 9000;
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
  
  const isValid = crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );

  return isValid;
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
   URL: http://31.97.252.100:${PORT}/hooks/mn-deploy
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
