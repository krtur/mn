-- ==================== VERIFICAR DADOS TDAH ====================
-- Execute este script para verificar se os dados foram salvos corretamente

-- 1. Contar triagens salvas
SELECT COUNT(*) as total_triagens FROM tdah_screenings;

-- 2. Listar todas as triagens com detalhes
SELECT 
  id,
  patient_id,
  therapist_id,
  total_percentage,
  risk_level,
  test_duration,
  created_at
FROM tdah_screenings
ORDER BY created_at DESC;

-- 3. Verificar pacientes e seus terapeutas
SELECT 
  u.id,
  u.name,
  u.email,
  u.role,
  u.therapist_id,
  t.name as therapist_name
FROM users u
LEFT JOIN users t ON u.therapist_id = t.id
WHERE u.role = 'patient'
ORDER BY u.created_at DESC;

-- 4. Verificar triagens por paciente
SELECT 
  ts.id,
  ts.patient_id,
  u.name as patient_name,
  ts.total_percentage,
  ts.risk_level,
  ts.created_at
FROM tdah_screenings ts
JOIN users u ON ts.patient_id = u.id
ORDER BY ts.created_at DESC;

-- 5. Verificar políticas RLS
SELECT * FROM pg_policies WHERE tablename = 'tdah_screenings';

-- 6. Testar acesso do terapeuta (substitua o ID do terapeuta)
-- Exemplo: SELECT * FROM tdah_screenings WHERE patient_id IN (SELECT id FROM users WHERE therapist_id = '028d8869-679f-4093-b435-1a43b6ced0e2');
