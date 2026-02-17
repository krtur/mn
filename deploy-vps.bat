@echo off
set VPS_IP=31.97.252.100
set VPS_USER=root
set VPS_PASS=Taliteus@1202
set RemoteDir=/var/www/mn

echo 🚀 Iniciando deploy Docker no VPS...

:: 1. Criar diretorios remotos
echo 📁 Criando diretorios remotos...
echo y | plink -batch -pw %VPS_PASS% %VPS_USER%@%VPS_IP% "mkdir -p %RemoteDir%/components %RemoteDir%/context %RemoteDir%/data %RemoteDir%/hooks %RemoteDir%/i18n %RemoteDir%/public %RemoteDir%/services"

:: 2. Copiar arquivos da raiz
echo 📤 Copiando arquivos da raiz...
echo y | pscp -pw %VPS_PASS% Dockerfile %VPS_USER%@%VPS_IP%:%RemoteDir%/Dockerfile
echo y | pscp -pw %VPS_PASS% docker-compose.yml %VPS_USER%@%VPS_IP%:%RemoteDir%/docker-compose.yml
echo y | pscp -pw %VPS_PASS% .env %VPS_USER%@%VPS_IP%:%RemoteDir%/.env
echo y | pscp -pw %VPS_PASS% package.json %VPS_USER%@%VPS_IP%:%RemoteDir%/package.json
echo y | pscp -pw %VPS_PASS% index.html %VPS_USER%@%VPS_IP%:%RemoteDir%/index.html
echo y | pscp -pw %VPS_PASS% index.tsx %VPS_USER%@%VPS_IP%:%RemoteDir%/index.tsx
echo y | pscp -pw %VPS_PASS% App.tsx %VPS_USER%@%VPS_IP%:%RemoteDir%/App.tsx
echo y | pscp -pw %VPS_PASS% vite.config.ts %VPS_USER%@%VPS_IP%:%RemoteDir%/vite.config.ts
echo y | pscp -pw %VPS_PASS% tsconfig.json %VPS_USER%@%VPS_IP%:%RemoteDir%/tsconfig.json
echo y | pscp -pw %VPS_PASS% tailwind.config.js %VPS_USER%@%VPS_IP%:%RemoteDir%/tailwind.config.js
echo y | pscp -pw %VPS_PASS% postcss.config.js %VPS_USER%@%VPS_IP%:%RemoteDir%/postcss.config.js
echo y | pscp -pw %VPS_PASS% index.css %VPS_USER%@%VPS_IP%:%RemoteDir%/index.css
echo y | pscp -pw %VPS_PASS% server.js %VPS_USER%@%VPS_IP%:%RemoteDir%/server.js
echo y | pscp -pw %VPS_PASS% webhook-server.js %VPS_USER%@%VPS_IP%:%RemoteDir%/webhook-server.js
echo y | pscp -pw %VPS_PASS% WEBHOOK_SETUP_FINAL.sh %VPS_USER%@%VPS_IP%:%RemoteDir%/WEBHOOK_SETUP_FINAL.sh

:: 3. Copiar diretorios recursivamente


echo 📤 Copiando diretorios...
echo y | pscp -pw %VPS_PASS% -r components %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r context %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r data %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r hooks %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r i18n %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r public %VPS_USER%@%VPS_IP%:%RemoteDir%/
echo y | pscp -pw %VPS_PASS% -r services %VPS_USER%@%VPS_IP%:%RemoteDir%/

:: 4. Iniciar Docker e configurar Nginx
echo ▶️ Iniciando Docker e Nginx no VPS...
:: Copiar Nginx config primeiro
echo y | pscp -pw %VPS_PASS% nginx_mn.conf %VPS_USER%@%VPS_IP%:/etc/nginx/sites-available/mn
echo y | plink -batch -pw %VPS_PASS% %VPS_USER%@%VPS_IP% "cd %RemoteDir% && docker compose up -d --build && ln -sf /etc/nginx/sites-available/mn /etc/nginx/sites-enabled/mn && rm -f /etc/nginx/sites-enabled/default && nginx -t && systemctl restart nginx"


echo.
echo ✅ Processo finalizado!
