-- ==================== TABELA TDAH SCREENINGS ====================

-- Criar tabela de triagens TDAH
CREATE TABLE IF NOT EXISTS tdah_screenings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  therapist_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Respostas (JSON com todas as 100 respostas)
  answers JSONB NOT NULL,
  
  -- Pontuações por categoria
  category_a_score INTEGER NOT NULL,
  category_b_score INTEGER NOT NULL,
  category_c_score INTEGER NOT NULL,
  category_d_score INTEGER NOT NULL,
  category_e_score INTEGER NOT NULL,
  category_f_score INTEGER NOT NULL,
  
  -- Pontuação total
  total_score INTEGER NOT NULL,
  total_percentage INTEGER NOT NULL,
  
  -- Nível de risco
  risk_level VARCHAR(20) NOT NULL, -- 'Baixo', 'Moderado', 'Alto', 'Muito Alto'
  
  -- Tempo de duração do teste em segundos
  test_duration INTEGER,
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_tdah_patient_id ON tdah_screenings(patient_id);
CREATE INDEX IF NOT EXISTS idx_tdah_therapist_id ON tdah_screenings(therapist_id);
CREATE INDEX IF NOT EXISTS idx_tdah_created_at ON tdah_screenings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tdah_risk_level ON tdah_screenings(risk_level);

-- ==================== ROW LEVEL SECURITY ====================

-- Habilitar RLS
ALTER TABLE tdah_screenings ENABLE ROW LEVEL SECURITY;

-- Política: Pacientes podem ver suas próprias triagens
CREATE POLICY "Patients can view own screenings"
  ON tdah_screenings FOR SELECT
  USING (auth.uid() = patient_id);

-- Política: Pacientes podem inserir suas próprias triagens
CREATE POLICY "Patients can insert own screenings"
  ON tdah_screenings FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Política: Pacientes podem atualizar suas próprias triagens
CREATE POLICY "Patients can update own screenings"
  ON tdah_screenings FOR UPDATE
  USING (auth.uid() = patient_id);

-- Política: Terapeutas podem ver triagens de seus pacientes
CREATE POLICY "Therapists can view patient screenings"
  ON tdah_screenings FOR SELECT
  USING (
    therapist_id = auth.uid() OR
    patient_id IN (
      SELECT id FROM users WHERE therapist_id = auth.uid()
    )
  );

-- ==================== REALTIME ====================

-- Habilitar realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE tdah_screenings;

-- ==================== COMENTÁRIOS ====================

COMMENT ON TABLE tdah_screenings IS 'Armazena os resultados das triagens TDAH dos pacientes';
COMMENT ON COLUMN tdah_screenings.answers IS 'JSON com todas as 100 respostas: {questionId: value, ...}';
COMMENT ON COLUMN tdah_screenings.risk_level IS 'Nível de risco calculado: Baixo (0-25%), Moderado (25-50%), Alto (50-75%), Muito Alto (75-100%)';
