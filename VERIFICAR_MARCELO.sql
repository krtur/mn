-- Verificar se Marcelo existe na tabela users
SELECT id, email, name, role, created_at 
FROM users 
WHERE email = 'marcelo@mnterapeutas.com';

-- Verificar todos os terapeutas
SELECT id, email, name, role, created_at 
FROM users 
WHERE role IN ('therapist_a', 'therapist_b');

-- Verificar se há algum usuário com ID do Marcelo
SELECT id, email, name, role, created_at 
FROM users 
WHERE id = '028d8869-679f-4093-b435-1a43b6ced0e2';
