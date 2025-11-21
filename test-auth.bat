@echo off
echo ===================================================
echo Testando autenticacao com Supabase
echo ===================================================
echo Digite sua senha:
set /p password=

node test-supabase.js %password%

pause
