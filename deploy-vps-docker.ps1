# ============================================
# Script PowerShell - Deploy Docker para VPS
# ============================================

$VPS_IP = "31.97.252.100"
$VPS_USER = "root"
$VPS_PASS = "Taliteus@1202"
$RemoteDir = "/var/www/mn"
$RemoteScript = "/root/vps-docker-setup.sh"

Write-Host "🚀 Iniciando deploy Docker no VPS..." -ForegroundColor Green

# 1. Verificar Plink
if (-not (Get-Command plink -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Plink não encontrado. Instale o PuTTY ou adicione ao PATH." -ForegroundColor Red
    exit 1
}

# 2. Criar diretório remoto
Write-Host "📁 Criando diretório remoto..."
Write-Output "y" | plink -batch -pw $VPS_PASS "$VPS_USER@$VPS_IP" "mkdir -p $RemoteDir"

# 3. Copiar .env
Write-Host "📤 Copiando .env..."
Write-Output "y" | pscp -pw $VPS_PASS .env "$VPS_USER@$VPS_IP:$RemoteDir/.env"

# 4. Copiar script de setup
Write-Host "📤 Copiando script de setup..."
Write-Output "y" | pscp -pw $VPS_PASS vps-docker-setup.sh "$VPS_USER@$VPS_IP:$RemoteScript"

# 5. Executar setup
Write-Host "▶️ Executando setup remoto..."
$Cmd = "chmod +x $RemoteScript; $RemoteScript"
Write-Output "y" | plink -batch -pw $VPS_PASS "$VPS_USER@$VPS_IP" $Cmd

Write-Host ""
Write-Host "✅ Processo finalizado!" -ForegroundColor Green
