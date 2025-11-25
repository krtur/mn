#!/bin/bash

# ============================================
# VPS Setup Script - M&N Terapeutas
# Ubuntu 24.04 - Hostinger VPS
# ============================================

set -e

echo "🚀 Iniciando configuração do VPS..."

# Atualizar sistema
echo "📦 Atualizando sistema..."
apt update && apt upgrade -y

# Instalar dependências básicas
echo "📦 Instalando dependências básicas..."
apt install -y curl git build-essential ufw

# Instalar Node.js 20 LTS
echo "📦 Instalando Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verificar instalação
echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Instalar PM2 globalmente
echo "📦 Instalando PM2..."
npm install -g pm2

# Instalar Nginx
echo "📦 Instalando Nginx..."
apt install -y nginx

# Configurar Firewall
echo "🔒 Configurando Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

# Criar diretório para aplicação
echo "📁 Criando diretório da aplicação..."
mkdir -p /var/www/mn
cd /var/www/mn

# Clonar repositório
echo "📥 Clonando repositório do GitHub..."
git clone https://github.com/krtur/mn.git .

# Instalar dependências do projeto
echo "📦 Instalando dependências do projeto..."
npm install

# Criar arquivo .env (você precisará editar depois)
echo "📝 Criando arquivo .env..."
cat > .env << 'EOF'
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_key_aqui
EOF

echo ""
echo "⚠️  IMPORTANTE: Edite o arquivo /var/www/mn/.env com suas credenciais do Supabase!"
echo ""

# Build do projeto
echo "🔨 Fazendo build do projeto..."
npm run build

# Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/mn << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name 31.97.252.100;

    root /var/www/mn/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache para assets estáticos
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
EOF

# Ativar site
ln -sf /etc/nginx/sites-available/mn /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Testar configuração do Nginx
nginx -t

# Reiniciar Nginx
systemctl restart nginx
systemctl enable nginx

# Criar script de deploy
echo "📝 Criando script de deploy automático..."
cat > /var/www/mn/deploy.sh << 'EOF'
#!/bin/bash

set -e

echo "🔄 Iniciando deploy automático..."

cd /var/www/mn

# Pull das últimas alterações
echo "📥 Baixando alterações do GitHub..."
git pull origin main

# Instalar/atualizar dependências
echo "📦 Instalando dependências..."
npm install

# Build do projeto
echo "🔨 Fazendo build..."
npm run build

# Reiniciar Nginx
echo "🔄 Reiniciando Nginx..."
systemctl restart nginx

echo "✅ Deploy concluído com sucesso!"
echo "🌐 Acesse: http://31.97.252.100"
EOF

chmod +x /var/www/mn/deploy.sh

# Instalar webhook listener
echo "📦 Instalando webhook listener..."
npm install -g webhook

# Criar configuração do webhook
echo "📝 Configurando webhook..."
mkdir -p /var/www/webhook
cat > /var/www/webhook/hooks.json << 'EOF'
[
  {
    "id": "mn-deploy",
    "execute-command": "/var/www/mn/deploy.sh",
    "command-working-directory": "/var/www/mn",
    "response-message": "Deploy iniciado!",
    "trigger-rule": {
      "match": {
        "type": "payload-hash-sha256",
        "secret": "seu_secret_aqui_mude_isso",
        "parameter": {
          "source": "header",
          "name": "X-Hub-Signature-256"
        }
      }
    }
  }
]
EOF

# Criar serviço systemd para webhook
cat > /etc/systemd/system/webhook.service << 'EOF'
[Unit]
Description=GitHub Webhook Listener
After=network.target

[Service]
Type=simple
User=root
ExecStart=/usr/local/bin/webhook -hooks /var/www/webhook/hooks.json -verbose -port 9000
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Configurar Nginx para proxy do webhook
cat > /etc/nginx/sites-available/webhook << 'EOF'
server {
    listen 9000;
    server_name 31.97.252.100;

    location /hooks/ {
        proxy_pass http://localhost:9000/hooks/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -sf /etc/nginx/sites-available/webhook /etc/nginx/sites-enabled/

# Abrir porta 9000 no firewall
ufw allow 9000

# Recarregar Nginx
nginx -t && systemctl reload nginx

# Iniciar webhook service
systemctl daemon-reload
systemctl enable webhook
systemctl start webhook

echo ""
echo "============================================"
echo "✅ CONFIGURAÇÃO CONCLUÍDA COM SUCESSO!"
echo "============================================"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo ""
echo "1. Edite o arquivo .env com suas credenciais:"
echo "   nano /var/www/mn/.env"
echo ""
echo "2. Gere um secret para o webhook:"
echo "   openssl rand -hex 32"
echo ""
echo "3. Edite o arquivo de webhook com o secret:"
echo "   nano /var/www/webhook/hooks.json"
echo ""
echo "4. Configure o webhook no GitHub:"
echo "   - Vá em: https://github.com/krtur/mn/settings/hooks"
echo "   - Clique em 'Add webhook'"
echo "   - Payload URL: http://31.97.252.100:9000/hooks/mn-deploy"
echo "   - Content type: application/json"
echo "   - Secret: [cole o secret gerado no passo 2]"
echo "   - Events: Just the push event"
echo "   - Active: ✓"
echo ""
echo "5. Faça o primeiro deploy manual:"
echo "   /var/www/mn/deploy.sh"
echo ""
echo "🌐 Seu site estará disponível em: http://31.97.252.100"
echo ""
echo "📊 Comandos úteis:"
echo "   - Ver logs do webhook: journalctl -u webhook -f"
echo "   - Ver logs do Nginx: tail -f /var/log/nginx/error.log"
echo "   - Fazer deploy manual: /var/www/mn/deploy.sh"
echo "   - Reiniciar webhook: systemctl restart webhook"
echo ""
