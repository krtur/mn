-- ============================================
-- FIX SIMPLES: Adicionar coluna created_by
-- ============================================

-- 1. Adicionar a coluna se não existir
ALTER TABLE appointments 
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);

-- 2. Preencher valores NULL com o therapist_id (quem criou foi o terapeuta)
UPDATE appointments 
SET created_by = therapist_id 
WHERE created_by IS NULL;

-- 3. Tornar a coluna NOT NULL
ALTER TABLE appointments 
ALTER COLUMN created_by SET NOT NULL;

-- 4. Verificar resultado
SELECT id, patient_id, therapist_id, created_by, status 
FROM appointments 
LIMIT 5;
