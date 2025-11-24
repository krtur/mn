-- ============================================
-- TABELAS PARA SISTEMA DE AGENDAMENTOS
-- ============================================

-- 1. Tabela de Horários de Atendimento (Disponibilidade do Terapeuta)
CREATE TABLE IF NOT EXISTS therapist_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  day_of_week INT NOT NULL, -- 0 = domingo, 1 = segunda, ..., 6 = sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(therapist_id, day_of_week, start_time, end_time)
);

-- 2. Tabela de Agendamentos (Sessões)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, completed, cancelled
  notes TEXT,
  recurrence_id UUID, -- Referência ao agendamento recorrente pai
  created_by UUID NOT NULL REFERENCES users(id), -- Quem criou (terapeuta ou paciente)
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Tabela de Recorrências
CREATE TABLE IF NOT EXISTS appointment_recurrences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  patient_id UUID REFERENCES users(id) ON DELETE CASCADE, -- NULL se for horário aberto
  start_date DATE NOT NULL,
  end_date DATE, -- NULL se for indefinido
  frequency VARCHAR(20) NOT NULL, -- weekly, biweekly, monthly
  day_of_week INT, -- Para semanal/quinzenal (0-6)
  day_of_month INT, -- Para mensal (1-31)
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Tabela de Solicitações de Agendamento (Paciente solicita)
CREATE TABLE IF NOT EXISTS appointment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  requested_date DATE NOT NULL,
  requested_time TIME NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending', -- pending, approved, rejected, cancelled
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_therapist_availability_therapist_id ON therapist_availability(therapist_id);
CREATE INDEX IF NOT EXISTS idx_therapist_availability_day ON therapist_availability(day_of_week);
CREATE INDEX IF NOT EXISTS idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist_id ON appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointment_recurrences_therapist_id ON appointment_recurrences(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointment_recurrences_patient_id ON appointment_recurrences(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_patient_id ON appointment_requests(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_therapist_id ON appointment_requests(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointment_requests_status ON appointment_requests(status);

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS
ALTER TABLE therapist_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_recurrences ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_requests ENABLE ROW LEVEL SECURITY;

-- Políticas para therapist_availability
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem ver sua disponibilidade') THEN
    CREATE POLICY "Terapeutas podem ver sua disponibilidade" ON therapist_availability
      FOR SELECT USING (therapist_id = auth.uid() OR true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem criar sua disponibilidade') THEN
    CREATE POLICY "Terapeutas podem criar sua disponibilidade" ON therapist_availability
      FOR INSERT WITH CHECK (therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem atualizar sua disponibilidade') THEN
    CREATE POLICY "Terapeutas podem atualizar sua disponibilidade" ON therapist_availability
      FOR UPDATE USING (therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem deletar sua disponibilidade') THEN
    CREATE POLICY "Terapeutas podem deletar sua disponibilidade" ON therapist_availability
      FOR DELETE USING (therapist_id = auth.uid());
  END IF;
END $$;

-- Políticas para appointments
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuários podem ver seus agendamentos') THEN
    CREATE POLICY "Usuários podem ver seus agendamentos" ON appointments
      FOR SELECT USING (patient_id = auth.uid() OR therapist_id = auth.uid() OR true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuários podem criar agendamentos') THEN
    CREATE POLICY "Usuários podem criar agendamentos" ON appointments
      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuários podem atualizar seus agendamentos') THEN
    CREATE POLICY "Usuários podem atualizar seus agendamentos" ON appointments
      FOR UPDATE USING (patient_id = auth.uid() OR therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Usuários podem deletar seus agendamentos') THEN
    CREATE POLICY "Usuários podem deletar seus agendamentos" ON appointments
      FOR DELETE USING (patient_id = auth.uid() OR therapist_id = auth.uid());
  END IF;
END $$;

-- Políticas para appointment_recurrences
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem ver suas recorrências') THEN
    CREATE POLICY "Terapeutas podem ver suas recorrências" ON appointment_recurrences
      FOR SELECT USING (therapist_id = auth.uid() OR true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem criar recorrências') THEN
    CREATE POLICY "Terapeutas podem criar recorrências" ON appointment_recurrences
      FOR INSERT WITH CHECK (therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem atualizar recorrências') THEN
    CREATE POLICY "Terapeutas podem atualizar recorrências" ON appointment_recurrences
      FOR UPDATE USING (therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem deletar recorrências') THEN
    CREATE POLICY "Terapeutas podem deletar recorrências" ON appointment_recurrences
      FOR DELETE USING (therapist_id = auth.uid());
  END IF;
END $$;

-- Políticas para appointment_requests
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pacientes podem ver suas solicitações') THEN
    CREATE POLICY "Pacientes podem ver suas solicitações" ON appointment_requests
      FOR SELECT USING (patient_id = auth.uid() OR therapist_id = auth.uid() OR true);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pacientes podem criar solicitações') THEN
    CREATE POLICY "Pacientes podem criar solicitações" ON appointment_requests
      FOR INSERT WITH CHECK (patient_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Terapeutas podem atualizar solicitações') THEN
    CREATE POLICY "Terapeutas podem atualizar solicitações" ON appointment_requests
      FOR UPDATE USING (therapist_id = auth.uid());
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Pacientes podem cancelar solicitações') THEN
    CREATE POLICY "Pacientes podem cancelar solicitações" ON appointment_requests
      FOR DELETE USING (patient_id = auth.uid());
  END IF;
END $$;

-- ============================================
-- FUNÇÃO PARA GERAR AGENDAMENTOS RECORRENTES
-- ============================================

CREATE OR REPLACE FUNCTION generate_recurring_appointments()
RETURNS void AS $$
DECLARE
  rec RECORD;
  loop_date DATE;
  next_date DATE;
  appointment_start TIMESTAMP;
  appointment_end TIMESTAMP;
BEGIN
  FOR rec IN SELECT * FROM appointment_recurrences WHERE is_active = true AND (end_date IS NULL OR end_date >= CURRENT_DATE)
  LOOP
    loop_date := COALESCE(rec.start_date, CURRENT_DATE);
    
    WHILE loop_date <= COALESCE(rec.end_date, CURRENT_DATE + INTERVAL '1 year') LOOP
      -- Verificar se já existe agendamento para esta data
      IF NOT EXISTS (
        SELECT 1 FROM appointments 
        WHERE recurrence_id = rec.id 
        AND DATE(start_time) = loop_date
      ) THEN
        appointment_start := loop_date || ' ' || rec.start_time;
        appointment_end := loop_date || ' ' || rec.end_time;
        
        INSERT INTO appointments (
          patient_id, therapist_id, start_time, end_time, 
          status, recurrence_id, created_by
        ) VALUES (
          rec.patient_id, rec.therapist_id, appointment_start, appointment_end,
          'confirmed', rec.id, rec.therapist_id
        );
      END IF;
      
      -- Calcular próxima data
      CASE rec.frequency
        WHEN 'weekly' THEN
          next_date := loop_date + INTERVAL '1 week';
        WHEN 'biweekly' THEN
          next_date := loop_date + INTERVAL '2 weeks';
        WHEN 'monthly' THEN
          next_date := loop_date + INTERVAL '1 month';
        ELSE
          next_date := loop_date + INTERVAL '1 week';
      END CASE;
      
      loop_date := next_date;
    END LOOP;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGER PARA ATUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop triggers if they exist
DROP TRIGGER IF EXISTS update_therapist_availability_updated_at ON therapist_availability;
DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
DROP TRIGGER IF EXISTS update_appointment_recurrences_updated_at ON appointment_recurrences;
DROP TRIGGER IF EXISTS update_appointment_requests_updated_at ON appointment_requests;

-- Create triggers
CREATE TRIGGER update_therapist_availability_updated_at BEFORE UPDATE ON therapist_availability
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_recurrences_updated_at BEFORE UPDATE ON appointment_recurrences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_requests_updated_at BEFORE UPDATE ON appointment_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
