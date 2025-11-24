-- ============================================
-- VERIFICAR AGENDAMENTOS CRIADOS
-- ============================================

-- Ver todos os agendamentos
SELECT 
  a.id,
  a.patient_id,
  p.name as patient_name,
  a.therapist_id,
  t.name as therapist_name,
  a.start_time,
  a.end_time,
  a.status,
  a.created_at
FROM appointments a
LEFT JOIN users p ON a.patient_id = p.id
LEFT JOIN users t ON a.therapist_id = t.id
ORDER BY a.created_at DESC
LIMIT 20;

-- Ver agendamentos por paciente específico
-- Substitua 'PATIENT_ID' pelo ID do paciente
SELECT 
  id,
  patient_id,
  therapist_id,
  start_time,
  end_time,
  status
FROM appointments
WHERE patient_id = 'PATIENT_ID'
ORDER BY start_time DESC;

-- Ver agendamentos por terapeuta específico
-- Substitua 'THERAPIST_ID' pelo ID do terapeuta
SELECT 
  id,
  patient_id,
  therapist_id,
  start_time,
  end_time,
  status
FROM appointments
WHERE therapist_id = 'THERAPIST_ID'
ORDER BY start_time DESC;

-- Contar agendamentos por status
SELECT status, COUNT(*) as quantidade
FROM appointments
GROUP BY status;
