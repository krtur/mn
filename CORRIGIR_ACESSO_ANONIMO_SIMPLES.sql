-- Script simplificado para corrigir o acesso anônimo à tabela new_client_requests

-- 1. Conceder permissões de inserção para usuários anônimos
GRANT INSERT ON new_client_requests TO anon;

-- 2. Remover políticas existentes e criar uma nova
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;
DROP POLICY IF EXISTS "Anyone can create requests including anonymous" ON new_client_requests;

-- Criar nova política com nome único para evitar conflitos
CREATE POLICY "Anonymous insert policy for new_client_requests" 
  ON new_client_requests 
  FOR INSERT 
  WITH CHECK (true);

-- 3. Garantir que a tabela tenha RLS habilitado e forçado
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests FORCE ROW LEVEL SECURITY;

-- 4. Conceder permissão para executar a função uuid_generate_v4
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO anon;
