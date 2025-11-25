# ============================================
# Script PowerShell - Deploy Automático VPS
# ============================================

$VPS_IP = "31.97.252.100"
$VPS_USER = "root"
$VPS_PASS = "Taliteus@1202"

Write-Host "🚀 Iniciando deploy no VPS..." -ForegroundColor Green

# Criar script de setup inline
$SETUP_SCRIPT = @'
#!/bin/bash
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

echo "✅ Node.js version: $(node -v)"
echo "✅ NPM version: $(npm -v)"

# Instalar PM2
echo "📦 Instalando PM2..."
npm install -g pm2

# Instalar Nginx
echo "📦 Instalando Nginx..."
apt install -y nginx

# Configurar Firewall
echo "🔒 Configurando Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw allow 9000
ufw --force enable

# Criar diretório
echo "📁 Criando diretório..."
mkdir -p /var/www/mn
cd /var/www/mn

# Clonar repositório
echo "📥 Clonando repositório..."
git clone https://github.com/krtur/mn.git .

# Instalar dependências
echo "📦 Instalando dependências do projeto..."
npm install

# Criar .env temporário
cat > .env << 'ENVEOF'
VITE_SUPABASE_URL=sua_url_aqui
VITE_SUPABASE_ANON_KEY=sua_key_aqui
ENVEOF

# Build
echo "🔨 Fazendo build..."
npm run build

# Configurar Nginx
echo "🌐 Configurando Nginx..."
cat > /etc/nginx/sites-available/mn << 'NGINXEOF'
server {
    listen 80;
    listen [::]:80;
    server_name 31.97.252.100;
    root /var/www/mn/dist;
    index index.html;
    location / {
        try_files $uri $uri/ /index.html;
    }
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/javascript application/json;
}
NGINXEOF

ln -sf /etc/nginx/sites-available/mn /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx

# Criar script de deploy
cat > /var/www/mn/deploy.sh << 'DEPLOYEOF'
#!/bin/bash
set -e
echo "🔄 Iniciando deploy..."
cd /var/www/mn
git pull origin main
npm install
npm run build
systemctl restart nginx
echo "✅ Deploy concluído!"
DEPLOYEOF

chmod +x /var/www/mn/deploy.sh

# Instalar webhook
echo "📦 Instalando webhook..."
npm install -g webhook

# Configurar webhook
mkdir -p /var/www/webhook
cat > /var/www/webhook/hooks.json << 'WEBHOOKEOF'
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
WEBHOOKEOF

# Criar serviço webhook
cat > /etc/systemd/system/webhook.service << 'SERVICEEOF'
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
SERVICEEOF

systemctl daemon-reload
systemctl enable webhook
systemctl start webhook

echo ""
echo "============================================"
echo "✅ CONFIGURAÇÃO CONCLUÍDA!"
echo "============================================"
echo ""
echo "🌐 Site: http://31.97.252.100"
echo ""
echo "📋 PRÓXIMOS PASSOS:"
echo "1. Editar .env: nano /var/www/mn/.env"
echo "2. Gerar secret: openssl rand -hex 32"
echo "3. Editar webhook: nano /var/www/webhook/hooks.json"
echo "4. Configurar GitHub webhook"
echo ""
'@

Write-Host "📝 Criando script no VPS..." -ForegroundColor Yellow

# Usar plink (PuTTY) se disponível, senão usar ssh nativo
$command = "echo '$SETUP_SCRIPT' > /root/vps-setup.sh && chmod +x /root/vps-setup.sh && /root/vps-setup.sh"

Write-Host "🔌 Conectando ao VPS..." -ForegroundColor Yellow
Write-Host "⚠️  Você precisará digitar a senha: $VPS_PASS" -ForegroundColor Cyan
Write-Host ""

# Executar via SSH
ssh -o StrictHostKeyChecking=no ${VPS_USER}@${VPS_IP} $command

Write-Host ""
Write-Host "✅ Deploy concluído!" -ForegroundColor Green
Write-Host "🌐 Acesse: http://$VPS_IP" -ForegroundColor Cyan
