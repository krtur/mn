-- ============================================
-- DESABILITAR RLS PERMANENTEMENTE
-- ============================================

-- Desabilitar RLS em todas as tabelas de agendamentos
ALTER TABLE therapist_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_recurrences DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests DISABLE ROW LEVEL SECURITY;

-- Remover todas as políticas RLS (opcional, mas recomendado)
DROP POLICY IF EXISTS "Pacientes podem ver suas solicitações" ON appointment_requests;
DROP POLICY IF EXISTS "Pacientes podem criar solicitações" ON appointment_requests;
DROP POLICY IF EXISTS "Terapeutas podem atualizar solicitações" ON appointment_requests;
DROP POLICY IF EXISTS "Pacientes podem cancelar solicitações" ON appointment_requests;

-- Verificar status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('therapist_availability', 'appointments', 'appointment_recurrences', 'appointment_requests');
