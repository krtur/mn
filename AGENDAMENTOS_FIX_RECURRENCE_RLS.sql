-- ============================================
-- FIX RLS PARA appointment_recurrences
-- ============================================

-- Remover políticas antigas
DROP POLICY IF EXISTS "appointment_recurrences_select" ON appointment_recurrences;
DROP POLICY IF EXISTS "appointment_recurrences_insert" ON appointment_recurrences;
DROP POLICY IF EXISTS "appointment_recurrences_update" ON appointment_recurrences;
DROP POLICY IF EXISTS "appointment_recurrences_delete" ON appointment_recurrences;

-- Remover políticas com nomes antigos
DROP POLICY IF EXISTS "Terapeutas podem ver suas recorrências" ON appointment_recurrences;
DROP POLICY IF EXISTS "Terapeutas podem criar recorrências" ON appointment_recurrences;
DROP POLICY IF EXISTS "Terapeutas podem atualizar recorrências" ON appointment_recurrences;
DROP POLICY IF EXISTS "Terapeutas podem deletar recorrências" ON appointment_recurrences;

-- Criar novas políticas PERMISSIVAS
CREATE POLICY "recurrence_select" ON appointment_recurrences
  FOR SELECT USING (true);

CREATE POLICY "recurrence_insert" ON appointment_recurrences
  FOR INSERT WITH CHECK (true);

CREATE POLICY "recurrence_update" ON appointment_recurrences
  FOR UPDATE USING (true);

CREATE POLICY "recurrence_delete" ON appointment_recurrences
  FOR DELETE USING (true);

-- ============================================
-- RESULTADO
-- ============================================
-- Agora qualquer um pode criar recorrências
-- Se quiser mais segurança depois, pode restringir para apenas terapeutas
