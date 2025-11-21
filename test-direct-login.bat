@echo off
echo ===================================================
echo Testando login direto com Supabase
echo ===================================================
echo Digite seu email:
set /p email=
echo Digite sua senha:
set /p password=

node direct-login-test.js %email% %password%

pause
