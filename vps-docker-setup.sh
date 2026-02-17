#!/bin/bash
set -e

# ==========================================
# VPS Docker Setup Script
# ==========================================

APP_DIR="/var/www/mn"
REPO_URL="https://github.com/krtur/mn.git"

echo "🚀 Iniciando configuração Docker no VPS..."

# 1. Install Docker if not installed
if ! command -v docker &> /dev/null; then
    echo "📦 Instalando Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
    echo "✅ Docker instalado"
else
    echo "✅ Docker já instalado"
fi

# 2. Setup Directory
if [ ! -d "$APP_DIR" ]; then
    echo "📁 Criando diretório e clonando repositório..."
    mkdir -p "$APP_DIR"
    git clone "$REPO_URL" "$APP_DIR"
else
    echo "📁 Atualizando repositório..."
    cd "$APP_DIR"
    git pull origin main
fi

cd "$APP_DIR"

# 3. Create .env file from arguments or environment
# We expect the .env content to be passed or created before calling this script usually,
# or we can write it here if variables are exported.
# For now, we assume the deploy script will handle the .env content creation via SSH.

# 4. Start Application
echo "🐳 Iniciando containers..."
docker compose up -d --build

# 5. Configure Nginx Proxy
echo "🌐 Configurando Nginx Proxy..."
# Install Nginx if not exists (though previous setup might have it)
if ! command -v nginx &> /dev/null; then
    apt-get update && apt-get install -y nginx
fi

cat > /etc/nginx/sites-available/mn-docker << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 31.97.252.100;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/mn-docker /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
rm -f /etc/nginx/sites-enabled/mn # Remove old non-docker config if exists

nginx -t && systemctl restart nginx

echo "✅ Deploy Docker concluído! Aplicação rodando em http://31.97.252.100"
