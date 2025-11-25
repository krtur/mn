-- ==================== CORRIGIR POLÍTICAS RLS TDAH ====================
-- Execute este script para corrigir o acesso às triagens TDAH

-- 1. Remover políticas antigas
DROP POLICY IF EXISTS "Patients can view own screenings" ON tdah_screenings;
DROP POLICY IF EXISTS "Patients can insert own screenings" ON tdah_screenings;
DROP POLICY IF EXISTS "Patients can update own screenings" ON tdah_screenings;
DROP POLICY IF EXISTS "Therapists can view patient screenings" ON tdah_screenings;

-- 2. Criar novas políticas corrigidas

-- Política: Pacientes podem ver suas próprias triagens
CREATE POLICY "Patients can view own screenings"
  ON tdah_screenings FOR SELECT
  USING (auth.uid() = patient_id);

-- Política: Pacientes podem inserir suas próprias triagens (sem therapist_id obrigatório)
CREATE POLICY "Patients can insert own screenings"
  ON tdah_screenings FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Política: Pacientes podem atualizar suas próprias triagens
CREATE POLICY "Patients can update own screenings"
  ON tdah_screenings FOR UPDATE
  USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);

-- Política: Terapeutas podem ver triagens de seus pacientes
-- Usa a tabela users para verificar se o paciente está associado ao terapeuta
CREATE POLICY "Therapists can view patient screenings"
  ON tdah_screenings FOR SELECT
  USING (
    patient_id IN (
      SELECT id FROM users WHERE therapist_id = auth.uid()
    )
  );

-- 3. Verificar se as políticas foram criadas
SELECT * FROM pg_policies WHERE tablename = 'tdah_screenings';
