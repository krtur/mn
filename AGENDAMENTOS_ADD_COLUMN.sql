-- ============================================
-- ADICIONAR COLUNA created_by SE NÃO EXISTIR
-- ============================================

-- Verificar e adicionar coluna created_by na tabela appointments
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id);

-- Verificar e adicionar coluna recurrence_id se não existir
ALTER TABLE appointments
ADD COLUMN IF NOT EXISTS recurrence_id UUID;

-- Atualizar coluna created_by para valores existentes (se necessário)
UPDATE appointments SET created_by = therapist_id WHERE created_by IS NULL;

-- Remover o DEFAULT após popular os dados
ALTER TABLE appointments
ALTER COLUMN created_by DROP DEFAULT;

-- Adicionar constraint se não existir
ALTER TABLE appointments
ADD CONSTRAINT fk_created_by FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE;
