-- ============================================
-- VERIFICAR AGENDAMENTOS DO PACIENTE ESPECÍFICO
-- ============================================

-- ID do paciente do console: cb289c29-172e-4e02-869e-6ef3f0fb7d78

-- Ver dados do paciente
SELECT id, name, email, role FROM users WHERE id = 'cb289c29-172e-4e02-869e-6ef3f0fb7d78';

-- Ver agendamentos deste paciente
SELECT 
  a.id,
  a.patient_id,
  a.therapist_id,
  t.name as therapist_name,
  a.start_time,
  a.end_time,
  a.status
FROM appointments a
LEFT JOIN users t ON a.therapist_id = t.id
WHERE a.patient_id = 'cb289c29-172e-4e02-869e-6ef3f0fb7d78'
ORDER BY a.start_time DESC;

-- Ver TODOS os agendamentos (para comparação)
SELECT 
  a.id,
  a.patient_id,
  p.name as patient_name,
  a.therapist_id,
  t.name as therapist_name,
  a.start_time,
  a.status
FROM appointments a
LEFT JOIN users p ON a.patient_id = p.id
LEFT JOIN users t ON a.therapist_id = t.id
ORDER BY a.created_at DESC
LIMIT 30;
