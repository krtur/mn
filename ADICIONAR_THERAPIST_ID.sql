-- ============================================================================
-- ADICIONAR CAMPO therapist_id NA TABELA users
-- ============================================================================
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Adicionar coluna therapist_id
ALTER TABLE users ADD COLUMN therapist_id UUID;

-- 2. Adicionar constraint de chave estrangeira (opcional)
ALTER TABLE users 
ADD CONSTRAINT fk_users_therapist 
FOREIGN KEY (therapist_id) 
REFERENCES users(id) 
ON DELETE SET NULL;

-- 3. Criar índice para melhor performance
CREATE INDEX idx_users_therapist_id ON users(therapist_id);

-- ============================================================================
-- Pronto! Agora cada paciente pode ter um therapist_id associado
-- ============================================================================
