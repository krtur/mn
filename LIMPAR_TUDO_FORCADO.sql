-- ============================================================================
-- SCRIPT AGRESSIVO PARA LIMPAR TODOS OS DADOS FICTÍCIOS
-- ============================================================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Desabilita RLS temporariamente e deleta TUDO
-- ============================================================================

-- ============================================================================
-- 1. DESABILITAR RLS TEMPORARIAMENTE
-- ============================================================================

ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 2. DELETAR TUDO (CASCATA AUTOMÁTICA)
-- ============================================================================

-- Deletar documentos
DELETE FROM documents WHERE 1=1;

-- Deletar mensagens
DELETE FROM messages WHERE 1=1;

-- Deletar agendamentos
DELETE FROM appointments WHERE 1=1;

-- Deletar TODOS os usuários (vamos recriar os terapeutas depois)
DELETE FROM users WHERE 1=1;

-- ============================================================================
-- 3. RECRIAR OS TERAPEUTAS
-- ============================================================================
-- Substitua os IDs pelos IDs reais do Supabase Auth

INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
VALUES (
  '83273ffc-c878-4abc-a24b-e35fd4801339',
  'nadi@mnterapeutas.com',
  'Nadielma',
  '000.000.000-00',
  '(11) 99999-9999',
  'therapist_a',
  NOW(),
  NOW()
);

INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
VALUES (
  '028d8869-679f-4093-b435-1a43b6ced0e2',
  'marcelo@mnterapeutas.com',
  'Marcelo',
  '000.000.000-00',
  '(11) 99999-9999',
  'therapist_b',
  NOW(),
  NOW()
);

-- ============================================================================
-- 4. REABILITAR RLS
-- ============================================================================

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. VERIFICAR RESULTADO
-- ============================================================================

SELECT 'USUÁRIOS:' as info;
SELECT id, email, name, role FROM users ORDER BY created_at;

SELECT 'TOTAL DE AGENDAMENTOS:' as info;
SELECT COUNT(*) as total FROM appointments;

SELECT 'TOTAL DE MENSAGENS:' as info;
SELECT COUNT(*) as total FROM messages;

SELECT 'TOTAL DE DOCUMENTOS:' as info;
SELECT COUNT(*) as total FROM documents;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
