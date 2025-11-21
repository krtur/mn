# Como Obter a Chave de API Correta do Supabase

## Passos:

1. Acesse o Supabase Dashboard: https://app.supabase.com

2. Selecione seu projeto "M&N Terapeutas"

3. No menu lateral esquerdo, clique em **"Settings"** (Configurações)

4. Clique em **"API"**

5. Você verá duas chaves:
   - **Project URL**: https://ygfxloachqjeslciyunr.supabase.co
   - **anon public**: Esta é a chave que precisamos

6. Copie a chave **anon public** completa (ela começa com "eyJhbGciOi...")

7. Envie para mim a chave completa para que eu possa atualizar o projeto

## Importante:

- A chave anon public é segura para expor no código do frontend
- Não compartilhe a chave de serviço (service role key)
- Se a chave estiver expirada, você pode gerar uma nova

## Após obter a chave:

Envie a chave completa para que eu possa:
1. Atualizar o arquivo `.env`
2. Atualizar o arquivo `server.js`
3. Atualizar o arquivo `supabase.ts`
4. Atualizar o arquivo `simple-server.js`
5. Reiniciar os servidores com a chave correta
