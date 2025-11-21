-- ============================================================================
-- SCRIPT PARA LIMPAR TODOS OS DADOS FICTÍCIOS DO BANCO
-- ============================================================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- Isso vai deletar TODOS os dados fictícios deixando apenas os terapeutas
-- ============================================================================

-- ============================================================================
-- 1. DELETAR TODOS OS DOCUMENTOS
-- ============================================================================

DELETE FROM documents;

-- ============================================================================
-- 2. DELETAR TODAS AS MENSAGENS
-- ============================================================================

DELETE FROM messages;

-- ============================================================================
-- 3. DELETAR TODOS OS AGENDAMENTOS
-- ============================================================================

DELETE FROM appointments;

-- ============================================================================
-- 4. DELETAR TODOS OS PACIENTES FICTÍCIOS
-- ============================================================================
-- Mantém apenas os terapeutas (Nadielma e Marcelo)

DELETE FROM users 
WHERE role = 'patient';

-- ============================================================================
-- 5. VERIFICAR DADOS RESTANTES
-- ============================================================================

-- Verifique se apenas os terapeutas restaram:
SELECT id, email, name, role FROM users;

-- Verifique se não há agendamentos:
SELECT COUNT(*) as total_appointments FROM appointments;

-- Verifique se não há mensagens:
SELECT COUNT(*) as total_messages FROM messages;

-- Verifique se não há documentos:
SELECT COUNT(*) as total_documents FROM documents;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- Após executar este script, o banco estará limpo com apenas os terapeutas
-- Você pode agora cadastrar novos pacientes reais via /register
