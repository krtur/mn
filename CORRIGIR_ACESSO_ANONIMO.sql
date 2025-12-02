-- Verificar as configurações atuais de acesso anônimo
SELECT * FROM pg_roles WHERE rolname = 'anon';

-- Conceder permissões de inserção para usuários anônimos
GRANT INSERT ON new_client_requests TO anon;

-- Verificar as políticas RLS atuais
SELECT 
  tablename, 
  policyname, 
  permissive, 
  roles, 
  cmd, 
  qual, 
  with_check 
FROM pg_policies 
WHERE tablename = 'new_client_requests';

-- Remover e recriar a política de inserção para garantir que funcione
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;

CREATE POLICY "Anyone can create requests including anonymous" 
  ON new_client_requests 
  FOR INSERT 
  WITH CHECK (true);

-- Verificar se a tabela permite acesso anônimo
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'new_client_requests';

-- Garantir que a tabela tenha RLS habilitado e forçado
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests FORCE ROW LEVEL SECURITY;

-- Verificar permissões da tabela
SELECT 
  grantee, 
  table_name, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'new_client_requests';

-- Conceder permissões completas para anônimos na tabela
GRANT ALL ON new_client_requests TO anon;

-- Nota: A tabela usa uuid_generate_v4() em vez de uma sequência para o ID
-- Não há necessidade de conceder permissões para uma sequência

-- Verificar se o usuário anônimo pode chamar a função uuid_generate_v4
GRANT EXECUTE ON FUNCTION uuid_generate_v4() TO anon;

-- Verificar se há alguma restrição de chave estrangeira que possa estar causando problemas
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  a.attname AS column_name,
  confrelid::regclass AS referenced_table,
  af.attname AS referenced_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE c.contype = 'f' AND c.conrelid::regclass::text = 'new_client_requests';
