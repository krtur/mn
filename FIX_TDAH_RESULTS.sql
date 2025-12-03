-- Script para corrigir resultados TDAH sem therapist_id
-- Execute este script no SQL Editor do Supabase

-- 1. Primeiro, vamos verificar quais resultados estão sem therapist_id
SELECT 
  id, 
  patient_id, 
  therapist_id, 
  created_at 
FROM 
  tdah_screenings 
WHERE 
  therapist_id IS NULL;

-- 2. Agora vamos atualizar os resultados sem therapist_id
-- Este comando atualiza o therapist_id de cada screening com o therapist_id do paciente
UPDATE 
  tdah_screenings AS ts
SET 
  therapist_id = u.therapist_id
FROM 
  users AS u
WHERE 
  ts.patient_id = u.id
  AND ts.therapist_id IS NULL
  AND u.therapist_id IS NOT NULL;

-- 3. Verificar se ainda existem resultados sem therapist_id
SELECT 
  id, 
  patient_id, 
  therapist_id, 
  created_at 
FROM 
  tdah_screenings 
WHERE 
  therapist_id IS NULL;

-- 4. Verificar resultados para o terapeuta Marcelo (ID: 028d8869-679f-4093-b435-1a43b6ced0e2)
SELECT 
  ts.id, 
  ts.patient_id, 
  u.name AS patient_name,
  ts.created_at,
  ts.risk_level,
  ts.total_percentage
FROM 
  tdah_screenings AS ts
JOIN
  users AS u ON ts.patient_id = u.id
WHERE 
  ts.therapist_id = '028d8869-679f-4093-b435-1a43b6ced0e2'
ORDER BY
  ts.created_at DESC;

-- 5. Verificar pacientes do terapeuta Marcelo que fizeram o teste TDAH
SELECT
  u.id AS patient_id,
  u.name AS patient_name,
  u.email,
  COUNT(ts.id) AS tdah_tests_count
FROM
  users AS u
LEFT JOIN
  tdah_screenings AS ts ON u.id = ts.patient_id
WHERE
  u.therapist_id = '028d8869-679f-4093-b435-1a43b6ced0e2'
  AND u.role = 'patient'
GROUP BY
  u.id, u.name, u.email
ORDER BY
  tdah_tests_count DESC;
