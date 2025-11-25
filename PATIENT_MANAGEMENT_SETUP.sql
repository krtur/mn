-- ============================================
-- SETUP: Sistema de Gerenciamento de Pacientes
-- ============================================

-- 1. Tabela de Anotações Clínicas
CREATE TABLE IF NOT EXISTS patient_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_patient_notes_patient_id ON patient_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_notes_therapist_id ON patient_notes(therapist_id);
CREATE INDEX IF NOT EXISTS idx_patient_notes_created_at ON patient_notes(created_at DESC);

-- 2. Tabela de Progresso do Paciente
CREATE TABLE IF NOT EXISTS patient_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  category VARCHAR(100) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_patient_progress_patient_id ON patient_progress(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_progress_therapist_id ON patient_progress(therapist_id);
CREATE INDEX IF NOT EXISTS idx_patient_progress_date ON patient_progress(date DESC);
CREATE INDEX IF NOT EXISTS idx_patient_progress_category ON patient_progress(category);

-- 3. Tabela de Metas de Tratamento
CREATE TABLE IF NOT EXISTS patient_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  target_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_patient_goals_patient_id ON patient_goals(patient_id);
CREATE INDEX IF NOT EXISTS idx_patient_goals_therapist_id ON patient_goals(therapist_id);
CREATE INDEX IF NOT EXISTS idx_patient_goals_status ON patient_goals(status);
CREATE INDEX IF NOT EXISTS idx_patient_goals_target_date ON patient_goals(target_date);

-- 4. Tabela de Histórico de Sessões
CREATE TABLE IF NOT EXISTS session_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'no_show', 'cancelled', 'rescheduled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_session_history_patient_id ON session_history(patient_id);
CREATE INDEX IF NOT EXISTS idx_session_history_therapist_id ON session_history(therapist_id);
CREATE INDEX IF NOT EXISTS idx_session_history_session_date ON session_history(session_date DESC);
CREATE INDEX IF NOT EXISTS idx_session_history_status ON session_history(status);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE patient_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE patient_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_history ENABLE ROW LEVEL SECURITY;

-- Políticas para patient_notes
CREATE POLICY "Terapeutas podem ver notas de seus pacientes"
  ON patient_notes FOR SELECT
  USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar notas"
  ON patient_notes FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar suas notas"
  ON patient_notes FOR UPDATE
  USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem deletar suas notas"
  ON patient_notes FOR DELETE
  USING (auth.uid() = therapist_id);

-- Políticas para patient_progress
CREATE POLICY "Terapeutas podem ver progresso de seus pacientes"
  ON patient_progress FOR SELECT
  USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar progresso"
  ON patient_progress FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar progresso"
  ON patient_progress FOR UPDATE
  USING (auth.uid() = therapist_id);

-- Políticas para patient_goals
CREATE POLICY "Terapeutas podem ver metas de seus pacientes"
  ON patient_goals FOR SELECT
  USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar metas"
  ON patient_goals FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar metas"
  ON patient_goals FOR UPDATE
  USING (auth.uid() = therapist_id);

-- Políticas para session_history
CREATE POLICY "Terapeutas podem ver histórico de sessões"
  ON session_history FOR SELECT
  USING (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem criar histórico de sessões"
  ON session_history FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Terapeutas podem atualizar histórico de sessões"
  ON session_history FOR UPDATE
  USING (auth.uid() = therapist_id);

-- ============================================
-- REALTIME
-- ============================================

-- Habilitar realtime para todas as tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE patient_notes;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_progress;
ALTER PUBLICATION supabase_realtime ADD TABLE patient_goals;
ALTER PUBLICATION supabase_realtime ADD TABLE session_history;

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================

/*
PASSO 1: Execute este SQL no Supabase Dashboard > SQL Editor

PASSO 2: Verifique se as tabelas foram criadas:
- patient_notes
- patient_progress
- patient_goals
- session_history

PASSO 3: Teste a funcionalidade:
1. Login como terapeuta
2. Ir para "Meus Pacientes"
3. Clicar em "Ver" em um paciente
4. Usar as abas para adicionar notas, progresso, metas e sessões

PASSO 4: Dados de teste (opcional)
Você pode adicionar dados de teste usando as funções nos hooks:
- usePatientNotes: addNote()
- usePatientProgress: addProgressEntry(), addGoal()
- useSessionHistory: recordSession()

TABELAS CRIADAS:
- patient_notes: Anotações clínicas por sessão
- patient_progress: Registro de progresso (escala 1-10)
- patient_goals: Metas de tratamento
- session_history: Histórico de sessões (presença, duração, etc)

FUNCIONALIDADES:
✓ Adicionar/editar/deletar anotações clínicas
✓ Registrar progresso com categorias
✓ Definir e acompanhar metas
✓ Registrar histórico de sessões
✓ Filtrar e ordenar pacientes
✓ Visualizar em tabela ou cards
✓ Atualização em tempo real via WebSocket
*/
