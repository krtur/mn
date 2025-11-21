@echo off
echo ===================================================
echo Instalando dependencias do projeto M&N Terapeutas
echo ===================================================
call npm install

echo.
echo ===================================================
echo Iniciando o frontend em modo de desenvolvimento
echo ===================================================
start cmd /k "npm run dev"

echo.
echo ===================================================
echo Iniciando o servidor Express
echo ===================================================
node server.js

pause
