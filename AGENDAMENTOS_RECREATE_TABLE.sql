-- ============================================
-- RECRIAR TABELA appointments COM COLUNAS CORRETAS
-- ============================================
-- Execute este script se a tabela appointments não tiver as colunas corretas

-- 1. Remover tabelas dependentes primeiro
DROP TABLE IF EXISTS appointment_requests CASCADE;
DROP TABLE IF EXISTS appointment_recurrences CASCADE;
DROP TABLE IF EXISTS appointments CASCADE;

-- 2. Recriar tabela appointments com todas as colunas
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  notes TEXT,
  recurrence_id UUID,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Recriar tabela appointment_recurrences
CREATE TABLE appointment_recurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  frequency VARCHAR(20) NOT NULL,
  day_of_week INT,
  day_of_month INT,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Recriar tabela appointment_requests
CREATE TABLE appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Criar índices
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointment_recurrences_therapist_id ON appointment_recurrences(therapist_id);
CREATE INDEX idx_appointment_recurrences_patient_id ON appointment_recurrences(patient_id);
CREATE INDEX idx_appointment_requests_patient_id ON appointment_requests(patient_id);
CREATE INDEX idx_appointment_requests_therapist_id ON appointment_requests(therapist_id);
CREATE INDEX idx_appointment_requests_status ON appointment_requests(status);

-- 6. Habilitar RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_recurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- 7. Criar políticas permissivas
CREATE POLICY "appointments_select" ON appointments FOR SELECT USING (true);
CREATE POLICY "appointments_insert" ON appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "appointments_update" ON appointments FOR UPDATE USING (true);
CREATE POLICY "appointments_delete" ON appointments FOR DELETE USING (true);

CREATE POLICY "appointment_recurrences_select" ON appointment_recurrences FOR SELECT USING (true);
CREATE POLICY "appointment_recurrences_insert" ON appointment_recurrences FOR INSERT WITH CHECK (therapist_id = auth.uid());
CREATE POLICY "appointment_recurrences_update" ON appointment_recurrences FOR UPDATE USING (therapist_id = auth.uid());
CREATE POLICY "appointment_recurrences_delete" ON appointment_recurrences FOR DELETE USING (therapist_id = auth.uid());

CREATE POLICY "appointment_requests_select" ON appointment_requests FOR SELECT USING (true);
CREATE POLICY "appointment_requests_insert" ON appointment_requests FOR INSERT WITH CHECK (patient_id = auth.uid());
CREATE POLICY "appointment_requests_update" ON appointment_requests FOR UPDATE USING (therapist_id = auth.uid());
CREATE POLICY "appointment_requests_delete" ON appointment_requests FOR DELETE USING (patient_id = auth.uid());

-- 8. Criar triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_appointment_recurrences_updated_at ON appointment_recurrences;
DROP TRIGGER IF EXISTS update_appointment_requests_updated_at ON appointment_requests;

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_recurrences_updated_at BEFORE UPDATE ON appointment_recurrences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_requests_updated_at BEFORE UPDATE ON appointment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- PRONTO!
-- ============================================
-- Agora as tabelas estão corretas e sem a coluna created_by problemática
