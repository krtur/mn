-- ============================================
-- FIX: Adicionar coluna created_by à tabela appointments
-- ============================================

-- Verificar se a coluna existe
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'appointments' AND column_name = 'created_by';

-- Se não existir, adicionar a coluna
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS created_by UUID NOT NULL DEFAULT auth.uid() REFERENCES users(id);

-- Atualizar a constraint para ser NOT NULL sem default
ALTER TABLE appointments 
ALTER COLUMN created_by DROP DEFAULT;

-- Verificar se a coluna foi adicionada
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'appointments' 
ORDER BY ordinal_position;

-- Verificar a estrutura completa da tabela
\d appointments
