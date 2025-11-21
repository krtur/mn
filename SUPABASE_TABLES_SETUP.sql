-- ============================================================================
-- SETUP COMPLETO DO BANCO DE DADOS SUPABASE
-- ============================================================================
-- Execute este script no SQL Editor do Supabase Dashboard
-- ============================================================================

-- ============================================================================
-- 1. CRIAR TABELA DE USUÁRIOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  cpf TEXT,
  phone TEXT,
  role TEXT NOT NULL CHECK (role IN ('patient', 'therapist_a', 'therapist_b')),
  profile_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 2. CRIAR TABELA DE AGENDAMENTOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 3. CRIAR TABELA DE MENSAGENS
-- ============================================================================

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 4. CRIAR TABELA DE DOCUMENTOS
-- ============================================================================

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('report', 'diagnosis', 'progress_note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- 5. CRIAR ÍNDICES PARA MELHOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_start_time ON appointments(start_time);

CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);

CREATE INDEX IF NOT EXISTS idx_documents_patient ON documents(patient_id);
CREATE INDEX IF NOT EXISTS idx_documents_therapist ON documents(therapist_id);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(type);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 6. DESABILITAR RLS (para desenvolvimento)
-- ============================================================================
-- Descomente as linhas abaixo se quiser desabilitar RLS para desenvolvimento

-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE documents DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 7. CRIAR POLÍTICAS RLS (para produção)
-- ============================================================================
-- Descomente e use estas políticas em produção

-- -- Políticas para tabela users
-- CREATE POLICY "Users can view own data" ON users
--   FOR SELECT USING (auth.uid() = id);

-- CREATE POLICY "Users can update own data" ON users
--   FOR UPDATE USING (auth.uid() = id);

-- -- Políticas para tabela appointments
-- CREATE POLICY "Users can view own appointments" ON appointments
--   FOR SELECT USING (
--     auth.uid() = patient_id OR auth.uid() = therapist_id
--   );

-- CREATE POLICY "Users can create appointments" ON appointments
--   FOR INSERT WITH CHECK (auth.uid() = patient_id);

-- -- Políticas para tabela messages
-- CREATE POLICY "Users can view own messages" ON messages
--   FOR SELECT USING (
--     auth.uid() = sender_id OR auth.uid() = recipient_id
--   );

-- CREATE POLICY "Users can send messages" ON messages
--   FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- -- Políticas para tabela documents
-- CREATE POLICY "Users can view own documents" ON documents
--   FOR SELECT USING (
--     auth.uid() = patient_id OR auth.uid() = therapist_id
--   );

-- CREATE POLICY "Therapists can create documents" ON documents
--   FOR INSERT WITH CHECK (auth.uid() = therapist_id);

-- ============================================================================
-- 8. CRIAR TERAPEUTAS (OPCIONAL)
-- ============================================================================
-- Substitua os IDs pelos IDs reais gerados no Supabase Auth

-- INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
-- VALUES (
--   'ID_NADIELMA_AQUI',
--   'nadi@mnterapeutas.com',
--   'Nadielma',
--   '000.000.000-00',
--   '(11) 99999-9999',
--   'therapist_a',
--   NOW(),
--   NOW()
-- );

-- INSERT INTO users (id, email, name, cpf, phone, role, created_at, updated_at)
-- VALUES (
--   'ID_MARCELO_AQUI',
--   'marcelo@mnterapeutas.com',
--   'Marcelo',
--   '000.000.000-00',
--   '(11) 99999-9999',
--   'therapist_b',
--   NOW(),
--   NOW()
-- );

-- ============================================================================
-- 9. VERIFICAR TABELAS CRIADAS
-- ============================================================================

-- SELECT table_name FROM information_schema.tables 
-- WHERE table_schema = 'public' 
-- ORDER BY table_name;

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
