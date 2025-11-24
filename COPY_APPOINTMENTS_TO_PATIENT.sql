-- ============================================
-- COPIAR AGENDAMENTOS PARA OUTRO PACIENTE
-- ============================================

-- Copiar todos os agendamentos de um paciente para outro
-- De: 84a4ab3e-e137-4579-8e67-f5d5e19efd01 (MATHEUS CARVALHO MACHADO)
-- Para: cb289c29-172e-4e02-869e-6ef3f0fb7d78 (sotionz10@gmail.com)

INSERT INTO appointments (
  patient_id,
  therapist_id,
  start_time,
  end_time,
  status,
  notes,
  recurrence_id
)
SELECT 
  'cb289c29-172e-4e02-869e-6ef3f0fb7d78' as patient_id,
  therapist_id,
  start_time,
  end_time,
  status,
  notes,
  recurrence_id
FROM appointments
WHERE patient_id = '84a4ab3e-e137-4579-8e67-f5d5e19efd01'
AND NOT EXISTS (
  SELECT 1 FROM appointments a2
  WHERE a2.patient_id = 'cb289c29-172e-4e02-869e-6ef3f0fb7d78'
  AND a2.therapist_id = appointments.therapist_id
  AND a2.start_time = appointments.start_time
);

-- Verificar quantos foram copiados
SELECT COUNT(*) as agendamentos_copiados FROM appointments
WHERE patient_id = 'cb289c29-172e-4e02-869e-6ef3f0fb7d78';
