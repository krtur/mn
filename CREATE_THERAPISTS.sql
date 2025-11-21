-- Script para criar os usuários terapeutas no Supabase
-- Execute este script no SQL Editor do Supabase Dashboard

-- Nota: Os IDs serão gerados automaticamente pelo Supabase
-- Você precisará copiar os IDs gerados e atualizar o arquivo Register.tsx

-- 1. Criar usuário Nadielma via Supabase Auth
-- Vá para: Authentication > Users > Add user
-- Email: nadi@mnterapeutas.com
-- Password: Perante@1202
-- Marque "Auto confirm user"

-- 2. Criar usuário Marcelo via Supabase Auth
-- Vá para: Authentication > Users > Add user
-- Email: marcelo@mnterapeutas.com
-- Password: Perante@1202
-- Marque "Auto confirm user"

-- 3. Após criar os usuários, execute este SQL para adicionar à tabela users:

-- Inserir Nadielma (substitua o ID pelo ID real gerado)
INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
VALUES (
  'NADIELMA_ID_AQUI', -- Substitua pelo ID real
  'nadi@mnterapeutas.com',
  'Nadielma',
  '000.000.000-00',
  '(11) 99999-9999',
  'therapist_a',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Inserir Marcelo (substitua o ID pelo ID real gerado)
INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
VALUES (
  'MARCELO_ID_AQUI', -- Substitua pelo ID real
  'marcelo@mnterapeutas.com',
  'Marcelo',
  '000.000.000-00',
  '(11) 99999-9999',
  'therapist_b',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET updated_at = NOW();

-- Após executar este SQL, atualize o arquivo:
-- components/auth/Register.tsx
-- 
-- Substitua os IDs em THERAPISTS:
-- const THERAPISTS = {
--   nadi: {
--     id: 'NADIELMA_ID_AQUI', // ID real do Supabase
--     name: 'Nadielma',
--     email: 'nadi@mnterapeutas.com',
--   },
--   marcelo: {
--     id: 'MARCELO_ID_AQUI', // ID real do Supabase
--     name: 'Marcelo',
--     email: 'marcelo@mnterapeutas.com',
--   },
-- };
