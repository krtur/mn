-- Script para corrigir configurações do cliente Supabase

-- 1. Verificar se a tabela tem RLS habilitado mas NÃO forçado
-- Isso permite que o superusuário ignore as políticas RLS
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests NO FORCE ROW LEVEL SECURITY;

-- 2. Conceder permissões específicas para o usuário anônimo
GRANT SELECT, INSERT ON new_client_requests TO anon;

-- 3. Criar uma política específica para inserção anônima
-- Primeiro remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;
DROP POLICY IF EXISTS "Anyone can create requests including anonymous" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy for new_client_requests" ON new_client_requests;
DROP POLICY IF EXISTS "frontend_anonymous_insert" ON new_client_requests;

-- Criar nova política específica para inserção anônima
CREATE POLICY "anon_insert_policy" 
  ON new_client_requests 
  FOR INSERT 
  TO anon
  WITH CHECK (true);

-- 4. Verificar se as alterações foram aplicadas
SELECT tablename, policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'new_client_requests';

-- 5. Verificar permissões da tabela
SELECT grantee, table_name, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'new_client_requests' AND grantee = 'anon';
