-- Script final para corrigir as permissões do Supabase
-- Este script configura corretamente as permissões para permitir inserções anônimas
-- na tabela new_client_requests

-- 1. Habilitar RLS mas NÃO forçar (permite que o serviço de administração ignore RLS)
ALTER TABLE new_client_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE new_client_requests NO FORCE ROW LEVEL SECURITY;

-- 2. Conceder permissões explícitas para o usuário anônimo
GRANT SELECT, INSERT ON new_client_requests TO anon;
GRANT USAGE ON SCHEMA public TO anon;

-- 3. Remover todas as políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;
DROP POLICY IF EXISTS "Anyone can create requests including anonymous" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy for new_client_requests" ON new_client_requests;
DROP POLICY IF EXISTS "frontend_anonymous_insert" ON new_client_requests;
DROP POLICY IF EXISTS "anon_insert_policy" ON new_client_requests;

-- 4. Criar políticas específicas e claras

-- Política para permitir que qualquer pessoa (incluindo anônimos) insira registros
CREATE POLICY "insert_policy_for_anyone"
  ON new_client_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Política para permitir que terapeutas vejam solicitações destinadas a eles
CREATE POLICY "select_policy_for_therapists"
  ON new_client_requests
  FOR SELECT
  TO authenticated
  USING (
    -- Usuário autenticado é um terapeuta e a solicitação é para ele
    (auth.uid() = therapist_id)
  );

-- 5. Verificar se a sequência existe antes de conceder permissões
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'new_client_requests_id_seq'
  ) THEN
    EXECUTE 'GRANT USAGE ON SEQUENCE new_client_requests_id_seq TO anon';
  END IF;
END
$$;

-- 6. Verificar configuração
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'new_client_requests';
SELECT policyname, permissive, roles, cmd, qual, with_check FROM pg_policies WHERE tablename = 'new_client_requests';
