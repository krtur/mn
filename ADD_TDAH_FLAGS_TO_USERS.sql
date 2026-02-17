-- Adicionar colunas para controle de Triagem TDAH na tabela users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS tdah_screening_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS tdah_screening_paid BOOLEAN DEFAULT FALSE;

-- Atualizar políticas de segurança (RLS) se necessário
-- (Geralmente, se users é public ou auth.users, precisamos garantir que updates sejam permitidos)
-- Assumindo que users é a tabela que guarda dados do perfil e já tem políticas.

-- Comentário para documentação
COMMENT ON COLUMN users.tdah_screening_enabled IS 'Indica se o terapeuta habilitou a triagem de TDAH para este paciente.';
COMMENT ON COLUMN users.tdah_screening_paid IS 'Indica se o paciente pagou pela triagem de TDAH.';
