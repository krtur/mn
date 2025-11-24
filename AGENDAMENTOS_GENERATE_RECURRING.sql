-- ============================================
-- GERAR AGENDAMENTOS RECORRENTES
-- ============================================

-- Executar a função que gera agendamentos a partir das recorrências
SELECT generate_recurring_appointments();

-- Verificar agendamentos criados
SELECT 
  id,
  patient_id,
  therapist_id,
  start_time,
  end_time,
  status,
  recurrence_id,
  created_at
FROM appointments
ORDER BY created_at DESC
LIMIT 30;

-- Verificar recorrências ativas
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
WHERE is_active = true
ORDER BY created_at DESC;
