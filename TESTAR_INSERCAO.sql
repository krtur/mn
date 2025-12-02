-- Testar inserção direta na tabela
INSERT INTO new_client_requests (
  name, 
  email, 
  phone, 
  therapist_id, 
  status
) VALUES (
  'Teste SQL', 
  'teste@sql.com', 
  '(11) 99999-9999', 
  '028d8869-679f-4093-b435-1a43b6ced0e2', -- ID do Marcelo
  'pending'
) RETURNING *;

-- Verificar se a inserção funcionou
SELECT * FROM new_client_requests ORDER BY created_at DESC LIMIT 1;
