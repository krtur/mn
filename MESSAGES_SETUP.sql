-- ============================================
-- SETUP DA TABELA DE MENSAGENS
-- ============================================

-- Criar tabela de mensagens se não existir
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_recipient ON messages(sender_id, recipient_id);

-- Habilitar RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas se existirem
DROP POLICY IF EXISTS "Users can view their messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update their messages" ON messages;

-- Criar novas políticas RLS
-- Usuários podem ver mensagens que enviaram ou receberam
CREATE POLICY "messages_select"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Usuários podem inserir mensagens (sender_id é definido automaticamente)
CREATE POLICY "messages_insert"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Usuários podem atualizar suas próprias mensagens (marcar como lida)
CREATE POLICY "messages_update"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- ============================================
-- INSTRUÇÕES DE USO
-- ============================================
-- 1. Copie todo o SQL acima
-- 2. Vá para Supabase Dashboard > SQL Editor
-- 3. Cole e execute
-- 4. Verifique se não há erros
-- 5. Pronto! A tabela está criada e configurada
