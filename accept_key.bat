@echo off
echo Aceitando chave do servidor...
echo y | plink -pw Taliteus@1202 root@31.97.252.100 "echo Conexao OK"
if %errorlevel% neq 0 (
    echo Falha ao conectar.
    exit /b %errorlevel%
)
echo Chave aceita com sucesso.
