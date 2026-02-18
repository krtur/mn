-- Verificar disponibilidade dos terapeutas
SELECT 
  ta.id,
  ta.day_of_week,
  ta.start_time,
  ta.end_time,
  u.name as therapist_name
FROM therapist_availability ta
JOIN users u ON ta.therapist_id = u.id;
