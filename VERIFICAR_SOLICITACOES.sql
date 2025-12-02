-- Verificar se a tabela foi criada corretamente
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'new_client_requests'
);

-- Verificar se há registros na tabela
SELECT COUNT(*) FROM new_client_requests;

-- Listar todas as solicitações
SELECT 
  id, 
  name, 
  email, 
  phone, 
  therapist_id, 
  status, 
  notes, 
  created_at, 
  updated_at 
FROM new_client_requests 
ORDER BY created_at DESC;

-- Verificar se as políticas RLS estão configuradas corretamente
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

-- Verificar se o terapeuta existe
SELECT id, name, email, role 
FROM users 
WHERE id IN ('83273ffc-c878-4abc-a24b-e35fd4801339', '028d8869-679f-4093-b435-1a43b6ced0e2');

-- Verificar se há algum problema com a referência de chave estrangeira
SELECT 
  conname AS constraint_name,
  conrelid::regclass AS table_name,
  a.attname AS column_name,
  confrelid::regclass AS referenced_table,
  af.attname AS referenced_column,
  confdeltype AS delete_rule
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) AND af.attrelid = c.confrelid
WHERE c.contype = 'f' AND c.conrelid::regclass::text = 'new_client_requests';
