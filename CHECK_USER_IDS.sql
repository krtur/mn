-- ============================================
-- VERIFICAR IDs DOS USUÁRIOS
-- ============================================

-- Ver todos os usuários e seus IDs
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM users
WHERE role = 'patient'
ORDER BY created_at DESC;

-- Ver agendamentos e seus pacientes
SELECT 
  a.id as appointment_id,
  a.patient_id,
  u.email,
  u.name,
  a.start_time,
  a.status
FROM appointments a
LEFT JOIN users u ON a.patient_id = u.id
ORDER BY a.created_at DESC
LIMIT 30;

-- Verificar se há agendamentos para sotionz10@gmail.com
SELECT 
  u.id,
  u.email,
  COUNT(a.id) as total_agendamentos
FROM users u
LEFT JOIN appointments a ON u.id = a.patient_id
WHERE u.email IN ('sotionz10@gmail.com', 'poinditi@hotmail.com')
GROUP BY u.id, u.email;
