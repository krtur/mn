-- ============================================
-- VERIFICAR CONFIGURAÇÃO DE MENSAGENS
-- ============================================

-- 1. Verificar se tabela existe
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'messages';

-- 2. Verificar estrutura da tabela
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'messages'
ORDER BY ordinal_position;

-- 3. Verificar RLS habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'messages';

-- 4. Verificar políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, qual, with_check
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'messages';

-- 5. Verificar índices
SELECT indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public' AND tablename = 'messages';

-- 6. Contar mensagens
SELECT COUNT(*) as total_mensagens FROM messages;

-- 7. Ver últimas mensagens
SELECT id, sender_id, recipient_id, content, read, created_at 
FROM messages 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- Se tudo estiver OK, as mensagens devem aparecer em tempo real
-- Se não aparecerem, verifique:
-- 1. RLS está habilitado? (rowsecurity = true)
-- 2. Políticas estão corretas?
-- 3. Realtime está habilitado na tabela?
-- ============================================
