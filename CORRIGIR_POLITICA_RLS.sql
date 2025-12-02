-- Remover a política anterior de inserção
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;

-- Criar uma nova política que permite inserções anônimas
CREATE POLICY "Anyone can create requests including anonymous" 
  ON new_client_requests FOR INSERT 
  WITH CHECK (true);

-- Verificar se a política foi criada corretamente
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
