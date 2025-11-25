-- ============================================
-- DESABILITAR RLS TEMPORARIAMENTE
-- ============================================

-- Desabilitar RLS em todas as tabelas de agendamentos
ALTER TABLE therapist_availability DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_recurrences DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests DISABLE ROW LEVEL SECURITY;

-- Verificar status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('therapist_availability', 'appointments', 'appointment_recurrences', 'appointment_requests');

-- Depois de testar, reabilitar com:
-- ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointment_recurrences ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;
