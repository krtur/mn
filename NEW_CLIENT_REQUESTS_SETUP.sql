-- SQL para criar a tabela de solicitações de novos clientes
CREATE TABLE IF NOT EXISTS new_client_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  therapist_id UUID REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Adicionar políticas de segurança (RLS)
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;

-- Política para terapeutas verem todas as solicitações
CREATE POLICY "Therapists can view all requests" 
  ON new_client_requests FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'therapist_a' OR role = 'therapist_b'
  ));

-- Política para inserção de novos registros (qualquer pessoa pode criar, incluindo anônimos)
CREATE POLICY "Anyone can create requests" 
  ON new_client_requests FOR INSERT 
  WITH CHECK (true);

-- Definir a tabela para permitir acesso anônimo
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests FORCE ROW LEVEL SECURITY;

-- Política para terapeutas atualizarem solicitações
CREATE POLICY "Therapists can update requests" 
  ON new_client_requests FOR UPDATE 
  USING (auth.uid() IN (
    SELECT id FROM users WHERE role = 'therapist_a' OR role = 'therapist_b'
  ));

-- Adicionar trigger para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_new_client_requests_updated_at
BEFORE UPDATE ON new_client_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
