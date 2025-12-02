-- Script para corrigir o problema no frontend

-- 1. Verificar se a tabela tem RLS habilitado e forçado
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'new_client_requests';

-- 2. Verificar todas as políticas RLS existentes
SELECT tablename, policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'new_client_requests';

-- 3. Garantir que a tabela tenha RLS habilitado mas NÃO forçado
-- Isso permite que o superusuário ignore as políticas RLS
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests NO FORCE ROW LEVEL SECURITY;

-- 4. Conceder todas as permissões para o usuário anônimo
GRANT ALL ON new_client_requests TO anon;

-- 5. Criar uma política específica para inserção anônima
-- Primeiro remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;
DROP POLICY IF EXISTS "Anyone can create requests including anonymous" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy for new_client_requests" ON new_client_requests;

-- Criar nova política
CREATE POLICY "frontend_anonymous_insert" 
  ON new_client_requests 
  FOR INSERT 
  WITH CHECK (true);

-- 6. Verificar se as alterações foram aplicadas
SELECT tablename, policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'new_client_requests';

-- 7. Verificar permissões da tabela
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'new_client_requests' AND grantee = 'anon';
