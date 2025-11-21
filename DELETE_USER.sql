-- ============================================
-- DELETAR USUÁRIO
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- Primeiro, encontrar o ID do usuário pelo email
-- Copie o ID que aparecer nos resultados

SELECT id, email FROM auth.users WHERE email = 'poinditi@hotmail.com';

-- Depois, execute os comandos abaixo substituindo {USER_ID} pelo ID encontrado acima:

-- Deletar da tabela users (se existir)
DELETE FROM public.users WHERE email = 'poinditi@hotmail.com';

-- Deletar da tabela auth.users (usuário de autenticação)
-- NOTA: Isso requer privilégios de admin no Supabase
DELETE FROM auth.users WHERE email = 'poinditi@hotmail.com';

-- ============================================
-- VERIFICAR SE FOI DELETADO
-- ============================================

SELECT id, email FROM auth.users WHERE email = 'poinditi@hotmail.com';
-- Deve retornar vazio (0 linhas)
