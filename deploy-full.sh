#!/bin/bash

set -e

echo "🔄 Iniciando deploy automático (FRONT + BACK)..."

cd /var/www/mn

# Pull das últimas alterações
echo "📥 Baixando alterações do GitHub..."
git pull origin main

# Instalar/atualizar dependências
echo "📦 Instalando dependências..."
npm install

# Build do frontend
echo "🔨 Fazendo build do frontend..."
npm run build

# Reiniciar backend com PM2
echo "🔄 Reiniciando backend com PM2..."
pm2 restart mn-backend || pm2 start server.js --name mn-backend

# Salvar configuração do PM2
pm2 save

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo ""
echo "✅ Deploy concluído com sucesso!"
echo "🌐 Frontend: http://31.97.252.100"
echo "🔌 Backend API: http://31.97.252.100:3001/api"
echo ""
echo "📊 Status dos serviços:"
pm2 status
