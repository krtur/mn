-- ============================================
-- FIX: Corrigir Políticas RLS para Supabase
-- ============================================
-- Execute este SQL no Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. REMOVER POLÍTICAS ANTIGAS
-- ============================================

DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;

-- ============================================
-- 2. CRIAR NOVAS POLÍTICAS CORRETAS
-- ============================================

-- Política: Qualquer um autenticado pode inserir (para cadastro)
CREATE POLICY "Allow authenticated users to insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Política: Usuários podem ver seus próprios dados
CREATE POLICY "Allow users to view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Allow users to update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ============================================
-- 3. REMOVER POLÍTICAS DE OUTRAS TABELAS
-- ============================================

DROP POLICY IF EXISTS "Users can view their appointments" ON appointments;
DROP POLICY IF EXISTS "Patients can create appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update their appointments" ON appointments;
DROP POLICY IF EXISTS "Users can delete their appointments" ON appointments;

DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Authenticated users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;

DROP POLICY IF EXISTS "Users can view their documents" ON documents;
DROP POLICY IF EXISTS "Therapists can create documents" ON documents;
DROP POLICY IF EXISTS "Therapists can update their documents" ON documents;
DROP POLICY IF EXISTS "Therapists can delete their documents" ON documents;

-- ============================================
-- 4. CRIAR NOVAS POLÍTICAS PARA AGENDAMENTOS
-- ============================================

CREATE POLICY "Allow users to view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Allow patients to create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Allow users to update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Allow users to delete their appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- ============================================
-- 5. CRIAR NOVAS POLÍTICAS PARA MENSAGENS
-- ============================================

CREATE POLICY "Allow users to view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Allow authenticated users to send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Allow users to update their messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- ============================================
-- 6. CRIAR NOVAS POLÍTICAS PARA DOCUMENTOS
-- ============================================

CREATE POLICY "Allow users to view their documents"
  ON documents FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Allow therapists to create documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Allow therapists to update their documents"
  ON documents FOR UPDATE
  USING (auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = therapist_id);

CREATE POLICY "Allow therapists to delete their documents"
  ON documents FOR DELETE
  USING (auth.uid() = therapist_id);

-- ============================================
-- FIM DO FIX
-- ============================================
-- Tudo pronto! Agora tente registrar novamente.
-- ============================================
