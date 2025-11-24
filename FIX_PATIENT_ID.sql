-- ============================================
-- VERIFICAR E CORRIGIR patient_id NOS AGENDAMENTOS
-- ============================================

-- Ver agendamentos com patient_id NULL
SELECT 
  id,
  patient_id,
  therapist_id,
  start_time,
  status
FROM appointments
WHERE patient_id IS NULL;

-- Se houver agendamentos com patient_id NULL, isso é o problema!
-- Os agendamentos criados pelo terapeuta devem ter patient_id preenchido

-- Para verificar se está tudo certo, execute:
SELECT 
  COUNT(*) as total_agendamentos,
  COUNT(CASE WHEN patient_id IS NULL THEN 1 END) as com_patient_null,
  COUNT(CASE WHEN patient_id IS NOT NULL THEN 1 END) as com_patient_preenchido
FROM appointments;
