-- ============================================
-- SETUP COMPLETO DO MARCELO
-- Execute este script no Supabase SQL Editor
-- ============================================

-- 1. Verificar se Marcelo já existe
SELECT 'Verificando Marcelo...' as status;
SELECT id, email, name, role FROM users WHERE email = 'marcelo@mnterapeutas.com';

-- 2. Se não existir, inserir Marcelo
-- IMPORTANTE: O ID deve corresponder ao criado no Auth do Supabase
INSERT INTO users (id, email, name, role, cpf, phone, created_at, updated_at)
VALUES (
  '028d8869-679f-4093-b435-1a43b6ced0e2',
  'marcelo@mnterapeutas.com',
  'Marcelo',
  'therapist_b',
  '00000000000',
  '00000000000',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email,
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  updated_at = NOW();

-- 3. Verificar resultado
SELECT 'Marcelo criado/atualizado com sucesso!' as status;
SELECT id, email, name, role, created_at FROM users WHERE email = 'marcelo@mnterapeutas.com';

-- 4. Verificar todos os terapeutas
SELECT 'Todos os terapeutas:' as status;
SELECT id, email, name, role FROM users WHERE role IN ('therapist_a', 'therapist_b');

-- 5. Verificar RLS
SELECT 'Verificando RLS:' as status;
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'users';
