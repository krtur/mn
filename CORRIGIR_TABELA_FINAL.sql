-- Script para corrigir definitivamente a tabela new_client_requests
-- Este script remove todas as políticas RLS e desativa o RLS para a tabela

-- 1. Verificar se a tabela existe
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'new_client_requests'
  ) THEN
    CREATE TABLE public.new_client_requests (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      therapist_id UUID NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END
$$;

-- 2. Remover todas as políticas existentes
DROP POLICY IF EXISTS "Anyone can create requests" ON new_client_requests;
DROP POLICY IF EXISTS "Anyone can create requests including anonymous" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy" ON new_client_requests;
DROP POLICY IF EXISTS "Anonymous insert policy for new_client_requests" ON new_client_requests;
DROP POLICY IF EXISTS "frontend_anonymous_insert" ON new_client_requests;
DROP POLICY IF EXISTS "anon_insert_policy" ON new_client_requests;
DROP POLICY IF EXISTS "insert_policy_for_anyone" ON new_client_requests;
DROP POLICY IF EXISTS "select_policy_for_therapists" ON new_client_requests;
DROP POLICY IF EXISTS "Therapists can view their requests" ON new_client_requests;
DROP POLICY IF EXISTS "Therapists can update their requests" ON new_client_requests;

-- 3. Desativar completamente o RLS para esta tabela
ALTER TABLE new_client_requests DISABLE ROW LEVEL SECURITY;

-- 4. Conceder permissões explícitas para todos os usuários
GRANT ALL ON new_client_requests TO authenticated;
GRANT ALL ON new_client_requests TO anon;
GRANT ALL ON new_client_requests TO service_role;

-- 5. Se houver uma sequência associada, conceder permissões
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_sequences WHERE schemaname = 'public' AND sequencename = 'new_client_requests_id_seq'
  ) THEN
    EXECUTE 'GRANT USAGE, SELECT ON SEQUENCE new_client_requests_id_seq TO anon, authenticated, service_role';
  END IF;
END
$$;

-- 6. Criar a função update_timestamp primeiro
CREATE OR REPLACE FUNCTION public.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Agora criar o trigger que usa a função
DROP TRIGGER IF EXISTS set_updated_at ON new_client_requests;
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON new_client_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_timestamp();

-- 8. Verificar configuração final
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'new_client_requests';
SELECT grantee, privilege_type FROM information_schema.role_table_grants WHERE table_name = 'new_client_requests';
