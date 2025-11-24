-- ============================================
-- DEBUG - VERIFICAR AGENDAMENTOS
-- ============================================

-- Ver todos os agendamentos criados
SELECT 
  id,
  patient_id,
  therapist_id,
  start_time,
  end_time,
  status,
  created_at,
  updated_at
FROM appointments
ORDER BY created_at DESC
LIMIT 20;

-- Ver contagem de agendamentos
SELECT COUNT(*) as total_agendamentos FROM appointments;

-- Ver agendamentos por status
SELECT status, COUNT(*) as quantidade
FROM appointments
GROUP BY status;

-- Ver agendamentos por terapeuta
SELECT 
  t.name as terapeuta,
  COUNT(a.id) as total_agendamentos
FROM appointments a
LEFT JOIN users t ON a.therapist_id = t.id
GROUP BY t.id, t.name;

-- Ver agendamentos por paciente
SELECT 
  p.name as paciente,
  COUNT(a.id) as total_agendamentos
FROM appointments a
LEFT JOIN users p ON a.patient_id = p.id
GROUP BY p.id, p.name;

-- Ver recorrências criadas
SELECT 
  id,
  therapist_id,
  patient_id,
  start_date,
  end_date,
  frequency,
  is_active,
  created_at
FROM appointment_recurrences
ORDER BY created_at DESC
LIMIT 10;

-- Ver solicitações de agendamento
SELECT 
  id,
  patient_id,
  therapist_id,
  requested_date,
  requested_time,
  status,
  created_at
FROM appointment_requests
ORDER BY created_at DESC
LIMIT 10;
