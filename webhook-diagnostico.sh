#!/bin/bash

# ============================================
# 🔍 DIAGNÓSTICO DO WEBHOOK E DEPLOY AUTOMÁTICO
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
║         🔍 DIAGNÓSTICO DE DEPLOY AUTOMÁTICO                   ║
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
WEBHOOK_PORT="9000"
WEBHOOK_SERVICE="webhook"
LOG_FILE="/tmp/webhook-diagnostico.log"

# Limpar log anterior
> $LOG_FILE

# Função para registrar no log
log() {
  echo "$1" >> $LOG_FILE
  echo -e "$1"
}

# ============================================
# 1. Verificar status do serviço webhook
# ============================================
echo -e "\n${BLUE}1️⃣ Verificando status do serviço webhook...${NC}"

if systemctl is-active --quiet $WEBHOOK_SERVICE; then
  log "${GREEN}✅ Serviço webhook está ativo${NC}"
  systemctl status $WEBHOOK_SERVICE | grep "Active:" >> $LOG_FILE
else
  log "${RED}❌ Serviço webhook NÃO está ativo${NC}"
  log "$(systemctl status $WEBHOOK_SERVICE)"
fi

# ============================================
# 2. Verificar logs do webhook
# ============================================
echo -e "\n${BLUE}2️⃣ Verificando logs do webhook...${NC}"

WEBHOOK_LOGS=$(journalctl -u $WEBHOOK_SERVICE -n 50 --no-pager)
echo "$WEBHOOK_LOGS" >> $LOG_FILE

if echo "$WEBHOOK_LOGS" | grep -q "error\|Error\|ERROR"; then
  log "${RED}❌ Erros encontrados nos logs do webhook${NC}"
  echo "$WEBHOOK_LOGS" | grep -i "error\|Error\|ERROR" | tail -10
else
  log "${GREEN}✅ Nenhum erro encontrado nos logs do webhook${NC}"
fi

# ============================================
# 3. Verificar configuração do Nginx
# ============================================
echo -e "\n${BLUE}3️⃣ Verificando configuração do Nginx...${NC}"

if [ -f "/etc/nginx/sites-enabled/webhook" ]; then
  log "${GREEN}✅ Configuração do Nginx para webhook encontrada${NC}"
  cat /etc/nginx/sites-enabled/webhook >> $LOG_FILE
else
  log "${RED}❌ Configuração do Nginx para webhook NÃO encontrada${NC}"
fi

# ============================================
# 4. Verificar portas em uso
# ============================================
echo -e "\n${BLUE}4️⃣ Verificando portas em uso...${NC}"

if command -v netstat &> /dev/null; then
  PORTS=$(netstat -tulpn | grep -E ":(9000|9001)")
  echo "$PORTS" >> $LOG_FILE
  
  if echo "$PORTS" | grep -q "9000"; then
    log "${GREEN}✅ Porta 9000 está em uso${NC}"
  else
    log "${RED}❌ Porta 9000 NÃO está em uso${NC}"
  fi
  
  if echo "$PORTS" | grep -q "9001"; then
    log "${GREEN}✅ Porta 9001 está em uso${NC}"
  else
    log "${RED}❌ Porta 9001 NÃO está em uso${NC}"
  fi
else
  log "${YELLOW}⚠️ Comando netstat não disponível${NC}"
fi

# ============================================
# 5. Testar webhook
# ============================================
echo -e "\n${BLUE}5️⃣ Testando webhook...${NC}"

# Health check
HEALTH_RESPONSE=$(curl -s -X GET http://localhost:9000/health 2>/dev/null || echo "")
echo "Health Response: $HEALTH_RESPONSE" >> $LOG_FILE

if echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  log "${GREEN}✅ Webhook health check OK${NC}"
else
  log "${RED}❌ Webhook health check falhou${NC}"
fi

# ============================================
# 6. Verificar firewall
# ============================================
echo -e "\n${BLUE}6️⃣ Verificando firewall...${NC}"

if command -v ufw &> /dev/null; then
  UFW_STATUS=$(ufw status | grep 9000)
  echo "$UFW_STATUS" >> $LOG_FILE
  
  if echo "$UFW_STATUS" | grep -q "9000.*ALLOW"; then
    log "${GREEN}✅ Porta 9000 está permitida no firewall${NC}"
  else
    log "${RED}❌ Porta 9000 pode estar bloqueada no firewall${NC}"
  fi
else
  log "${YELLOW}⚠️ UFW não instalado${NC}"
fi

# ============================================
# 7. Verificar webhook-server.js
# ============================================
echo -e "\n${BLUE}7️⃣ Verificando webhook-server.js...${NC}"

if [ -f "$PROJECT_DIR/webhook-server.js" ]; then
  log "${GREEN}✅ Arquivo webhook-server.js encontrado${NC}"
  ls -la "$PROJECT_DIR/webhook-server.js" >> $LOG_FILE
else
  log "${RED}❌ Arquivo webhook-server.js NÃO encontrado${NC}"
fi

# ============================================
# 8. Verificar configuração do systemd
# ============================================
echo -e "\n${BLUE}8️⃣ Verificando configuração do systemd...${NC}"

if [ -f "/etc/systemd/system/webhook.service" ]; then
  log "${GREEN}✅ Arquivo de serviço systemd encontrado${NC}"
  cat "/etc/systemd/system/webhook.service" >> $LOG_FILE
else
  log "${RED}❌ Arquivo de serviço systemd NÃO encontrado${NC}"
fi

# ============================================
# 9. Verificar cron jobs
# ============================================
echo -e "\n${BLUE}9️⃣ Verificando cron jobs...${NC}"

CRON_JOBS=$(crontab -l 2>/dev/null || echo "")
echo "$CRON_JOBS" >> $LOG_FILE

if echo "$CRON_JOBS" | grep -q "deploy\|webhook"; then
  log "${GREEN}✅ Cron jobs relacionados a deploy encontrados${NC}"
  echo "$CRON_JOBS" | grep "deploy\|webhook"
else
  log "${YELLOW}⚠️ Nenhum cron job relacionado a deploy encontrado${NC}"
fi

# ============================================
# 10. Verificar permissões
# ============================================
echo -e "\n${BLUE}🔟 Verificando permissões...${NC}"

if [ -f "$PROJECT_DIR/webhook-server.js" ]; then
  PERMISSIONS=$(ls -la "$PROJECT_DIR/webhook-server.js")
  echo "$PERMISSIONS" >> $LOG_FILE
  
  if echo "$PERMISSIONS" | grep -q "x"; then
    log "${GREEN}✅ webhook-server.js tem permissão de execução${NC}"
  else
    log "${RED}❌ webhook-server.js NÃO tem permissão de execução${NC}"
  fi
fi

# ============================================
# Resumo
# ============================================
echo -e "\n${BLUE}📋 RESUMO DO DIAGNÓSTICO:${NC}"

# Verificar problemas críticos
CRITICAL_ISSUES=0

if ! systemctl is-active --quiet $WEBHOOK_SERVICE; then
  echo -e "${RED}❌ Serviço webhook não está ativo${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES+1))
fi

if [ ! -f "$PROJECT_DIR/webhook-server.js" ]; then
  echo -e "${RED}❌ Arquivo webhook-server.js não encontrado${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES+1))
fi

if [ ! -f "/etc/systemd/system/webhook.service" ]; then
  echo -e "${RED}❌ Arquivo de serviço systemd não encontrado${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES+1))
fi

if ! echo "$HEALTH_RESPONSE" | grep -q "ok"; then
  echo -e "${RED}❌ Webhook health check falhou${NC}"
  CRITICAL_ISSUES=$((CRITICAL_ISSUES+1))
fi

if [ $CRITICAL_ISSUES -eq 0 ]; then
  echo -e "${GREEN}✅ Nenhum problema crítico encontrado${NC}"
else
  echo -e "${RED}❌ $CRITICAL_ISSUES problemas críticos encontrados${NC}"
fi

echo -e "\n${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ DIAGNÓSTICO CONCLUÍDO!${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "\n${BLUE}📋 Log completo salvo em: ${NC}$LOG_FILE"
echo -e "\n${YELLOW}⚠️ Execute o script de correção para resolver os problemas encontrados${NC}"
