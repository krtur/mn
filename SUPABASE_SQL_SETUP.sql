-- ============================================
-- M&N TERAPEUTAS - SUPABASE SQL SETUP
-- ============================================
-- Copie e cole este código no SQL Editor do Supabase
-- https://app.supabase.com → SQL Editor → New Query
-- ============================================

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'therapist_a', 'therapist_b')),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_role ON users(role);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Política: Qualquer um autenticado pode inserir (para cadastro)
CREATE POLICY "Authenticated users can insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 2. TABELA DE AGENDAMENTOS
-- ============================================

CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_start_time ON appointments(start_time);

-- RLS
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Users can delete their appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- ============================================
-- 3. TABELA DE MENSAGENS
-- ============================================

CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);
CREATE INDEX idx_messages_conversation ON messages(sender_id, recipient_id);

-- RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Authenticated users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update their messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- ============================================
-- 4. TABELA DE DOCUMENTOS
-- ============================================

CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('report', 'diagnosis', 'progress_note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_documents_therapist ON documents(therapist_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_created ON documents(created_at);

-- RLS
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their documents"
  ON documents FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Therapists can create documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Therapists can update their documents"
  ON documents FOR UPDATE
  USING (auth.uid() = therapist_id);

CREATE POLICY "Therapists can delete their documents"
  ON documents FOR DELETE
  USING (auth.uid() = therapist_id);

-- ============================================
-- 5. FUNÇÃO PARA ATUALIZAR updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at
  BEFORE UPDATE ON documents
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 6. HABILITAR REALTIME
-- ============================================

-- Habilitar realtime para mensagens
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE appointments;

-- ============================================
-- FIM DO SETUP
-- ============================================
-- Tudo pronto! Agora você pode:
-- 1. Fazer cadastro no frontend
-- 2. Verificar se os dados aparecem aqui
-- 3. Testar as funcionalidades
-- ============================================
