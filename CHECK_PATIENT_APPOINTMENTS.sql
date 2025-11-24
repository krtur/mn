-- ============================================
-- VERIFICAR AGENDAMENTOS POR PACIENTE
-- ============================================

-- Ver todos os pacientes e quantos agendamentos têm
SELECT 
  u.id,
  u.name,
  u.email,
  COUNT(a.id) as total_agendamentos
FROM users u
LEFT JOIN appointments a ON u.id = a.patient_id
WHERE u.role = 'patient'
GROUP BY u.id, u.name, u.email
ORDER BY total_agendamentos DESC;

-- Ver agendamentos de um paciente específico
-- Substitua 'PATIENT_ID' pelo ID do paciente
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
WHERE a.patient_id = 'PATIENT_ID'
ORDER BY a.start_time DESC;
