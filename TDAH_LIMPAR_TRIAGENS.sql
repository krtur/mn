-- ==================== LIMPAR TRIAGENS ANTIGAS ====================
-- Execute este script para limpar triagens salvas com IDs incorretos

-- 1. Ver todas as triagens antes de limpar
SELECT 
  id,
  patient_id,
  total_percentage,
  risk_level,
  created_at,
  (SELECT name FROM users WHERE id = patient_id) as patient_name
FROM tdah_screenings
ORDER BY created_at DESC;

-- 2. Deletar todas as triagens (se necessário)
-- DELETE FROM tdah_screenings;

-- 3. Verificar se foram deletadas
SELECT COUNT(*) as total_triagens FROM tdah_screenings;
