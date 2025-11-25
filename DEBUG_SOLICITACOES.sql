-- ============================================
-- DEBUG: Verificar solicitações de agendamento
-- ============================================

-- 1. Ver todas as solicitações
SELECT id, patient_id, therapist_id, status, requested_date, requested_time, created_at, updated_at
FROM appointment_requests
ORDER BY created_at DESC;

-- 2. Ver apenas solicitações pendentes
SELECT id, patient_id, therapist_id, status, requested_date, requested_time, created_at, updated_at
FROM appointment_requests
WHERE status = 'pending'
ORDER BY created_at DESC;

-- 3. Ver solicitações rejeitadas
SELECT id, patient_id, therapist_id, status, requested_date, requested_time, created_at, updated_at
FROM appointment_requests
WHERE status = 'rejected'
ORDER BY created_at DESC;

-- 4. Ver solicitações aprovadas
SELECT id, patient_id, therapist_id, status, requested_date, requested_time, created_at, updated_at
FROM appointment_requests
WHERE status = 'approved'
ORDER BY created_at DESC;

-- 5. Contar por status
SELECT status, COUNT(*) as total
FROM appointment_requests
GROUP BY status;
