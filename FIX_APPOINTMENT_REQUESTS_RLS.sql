-- Corrigir políticas RLS da tabela appointment_requests
-- Problema: Erro 403 ao tentar criar solicitação de agendamento

-- 1. Remover políticas antigas
DROP POLICY IF EXISTS "Users can view own appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Users can create appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Users can update own appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Therapists can view appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "Patients can view appointment requests" ON appointment_requests;
DROP POLICY IF EXISTS "patients_can_create_requests" ON appointment_requests;
DROP POLICY IF EXISTS "patients_can_view_own_requests" ON appointment_requests;
DROP POLICY IF EXISTS "patients_can_update_own_requests" ON appointment_requests;
DROP POLICY IF EXISTS "therapists_can_view_requests" ON appointment_requests;
DROP POLICY IF EXISTS "therapists_can_update_requests" ON appointment_requests;

-- 2. Habilitar RLS
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- 3. Criar novas políticas

-- Política para pacientes CRIAR solicitações (INSERT)
CREATE POLICY "patients_can_create_requests"
  ON appointment_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() = patient_id
  );

-- Política para pacientes VER suas próprias solicitações (SELECT)
CREATE POLICY "patients_can_view_own_requests"
  ON appointment_requests
  FOR SELECT
  USING (
    auth.uid() = patient_id
  );

-- Política para pacientes ATUALIZAR suas próprias solicitações (UPDATE)
CREATE POLICY "patients_can_update_own_requests"
  ON appointment_requests
  FOR UPDATE
  USING (
    auth.uid() = patient_id
  );

-- Política para terapeutas VER solicitações para eles (SELECT)
CREATE POLICY "therapists_can_view_requests"
  ON appointment_requests
  FOR SELECT
  USING (
    auth.uid() = therapist_id
  );

-- Política para terapeutas ATUALIZAR solicitações (aprovar/rejeitar)
CREATE POLICY "therapists_can_update_requests"
  ON appointment_requests
  FOR UPDATE
  USING (
    auth.uid() = therapist_id
  );

-- Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'appointment_requests';
