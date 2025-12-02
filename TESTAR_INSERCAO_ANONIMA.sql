-- Abordagem simplificada para testar inserção

-- 1. Verificar as permissões atuais
SELECT grantee, privilege_type 
FROM information_schema.role_table_grants 
WHERE table_name = 'new_client_requests' AND grantee = 'anon';

-- 2. Garantir que o usuário anônimo tenha permissões de inserção
GRANT INSERT ON new_client_requests TO anon;

-- 3. Verificar as políticas RLS existentes
SELECT policyname, cmd, roles, with_check 
FROM pg_policies 
WHERE tablename = 'new_client_requests';

-- 4. Criar uma política específica para inserção anônima se não existir
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'new_client_requests' 
    AND cmd = 'INSERT' 
    AND with_check::text = 'true'
  ) THEN
    EXECUTE 'CREATE POLICY "Anonymous insert policy" ON new_client_requests FOR INSERT WITH CHECK (true)';
  END IF;
END
$$;

-- 5. Tentar inserir diretamente (isso funciona porque você está logado como superusuário)
INSERT INTO new_client_requests (
  name, 
  email, 
  phone, 
  therapist_id, 
  status
) VALUES (
  'Teste Direto', 
  'direto@teste.com', 
  '(11) 77777-7777', 
  '028d8869-679f-4093-b435-1a43b6ced0e2', -- ID do Marcelo
  'pending'
) RETURNING *;

-- 6. Verificar se a inserção funcionou
SELECT * FROM new_client_requests ORDER BY created_at DESC LIMIT 5;
