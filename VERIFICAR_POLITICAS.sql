-- Verificar todas as políticas RLS para a tabela new_client_requests
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

-- Verificar permissões da tabela
SELECT 
  grantee, 
  table_name, 
  privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'new_client_requests';

-- Verificar se a tabela tem RLS habilitado
SELECT relname, relrowsecurity, relforcerowsecurity 
FROM pg_class 
WHERE relname = 'new_client_requests';
