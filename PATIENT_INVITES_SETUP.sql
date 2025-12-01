-- Criar tabela de convites de pacientes
CREATE TABLE IF NOT EXISTS patient_invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  therapist_id UUID NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  
  -- Garantir que não haja convites duplicados para o mesmo email
  CONSTRAINT unique_pending_invite UNIQUE (email, therapist_id, status)
);

-- Adicionar índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_patient_invites_therapist ON patient_invites(therapist_id);
CREATE INDEX IF NOT EXISTS idx_patient_invites_email ON patient_invites(email);
CREATE INDEX IF NOT EXISTS idx_patient_invites_status ON patient_invites(status);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE patient_invites ENABLE ROW LEVEL SECURITY;

-- Política para terapeutas verem apenas seus próprios convites
CREATE POLICY therapist_select_own_invites
  ON patient_invites FOR SELECT
  USING (auth.uid() = therapist_id);

-- Política para terapeutas criarem convites
CREATE POLICY therapist_insert_invites
  ON patient_invites FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

-- Política para terapeutas atualizarem seus próprios convites
CREATE POLICY therapist_update_own_invites
  ON patient_invites FOR UPDATE
  USING (auth.uid() = therapist_id);

-- Política para terapeutas excluírem seus próprios convites
CREATE POLICY therapist_delete_own_invites
  ON patient_invites FOR DELETE
  USING (auth.uid() = therapist_id);

-- Habilitar realtime para a tabela
ALTER PUBLICATION supabase_realtime ADD TABLE patient_invites;

-- Comentários para documentação
COMMENT ON TABLE patient_invites IS 'Convites enviados por terapeutas para pacientes se cadastrarem';
COMMENT ON COLUMN patient_invites.id IS 'ID único do convite';
COMMENT ON COLUMN patient_invites.email IS 'Email do paciente convidado';
COMMENT ON COLUMN patient_invites.name IS 'Nome do paciente convidado';
COMMENT ON COLUMN patient_invites.therapist_id IS 'ID do terapeuta que enviou o convite';
COMMENT ON COLUMN patient_invites.status IS 'Status do convite: pending, accepted, expired';
COMMENT ON COLUMN patient_invites.created_at IS 'Data de criação do convite';
COMMENT ON COLUMN patient_invites.expires_at IS 'Data de expiração do convite';
