# 🔧 Erro 401 - Supabase RLS Fix

**Erro**: `Failed to load resource: the server responded with a status of 401`
**Causa**: Políticas RLS (Row Level Security) bloqueando inserção
**Solução**: Atualizar políticas RLS

---

## ⚡ Solução Rápida (2 minutos)

### Passo 1: Abrir SQL Editor
1. Acesse: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Clique em: **New Query**

### Passo 2: Executar SQL
1. Abra o arquivo: `SUPABASE_RLS_FIX.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor (Ctrl+V)
4. Clique em: **Run** (botão azul)

**Resultado esperado**:
```
✓ DROP POLICY (se existir)
✓ CREATE POLICY
✓ DROP POLICY (se existir)
✓ CREATE POLICY
... (mais operações)
```

### Passo 3: Testar Novamente
1. Volte para http://localhost:3000
2. Clique em: **"Não tem conta? Cadastre-se"**
3. Preencha com **NOVOS DADOS**:
   - Email: `novo2@example.com`
   - CPF: `11111111111`
   - Nome: `Novo Usuário 2`
   - Telefone: `11987654321`
   - Perfil: `Paciente`
4. Clique em: **"Criar Conta"**

**Resultado esperado**:
```
✓ Cadastro bem-sucedido
✓ Redirecionado para dashboard
✓ Usuário aparece no Supabase
```

---

## 🔍 O Que Estava Errado

### Problema Original
As políticas RLS estavam muito restritivas:

```sql
-- ❌ ERRADO
CREATE POLICY "Authenticated users can insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Problema**: O usuário novo não tem `id` ainda (é gerado pelo Supabase)

### Solução
Usar a política correta:

```sql
-- ✅ CORRETO
CREATE POLICY "Allow authenticated users to insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

**Explicação**: Permite que usuários autenticados insiram dados onde `auth.uid()` (ID do usuário autenticado) = `id` (coluna id da tabela)

---

## 📊 Políticas Atualizadas

### Tabela: users
```sql
-- Inserir (cadastro)
CREATE POLICY "Allow authenticated users to insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Visualizar (próprios dados)
CREATE POLICY "Allow users to view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Atualizar (próprios dados)
CREATE POLICY "Allow users to update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
```

### Tabela: appointments
```sql
-- Visualizar (próprios agendamentos)
CREATE POLICY "Allow users to view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Criar (paciente cria)
CREATE POLICY "Allow patients to create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

-- Atualizar
CREATE POLICY "Allow users to update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Deletar
CREATE POLICY "Allow users to delete their appointments"
  ON appointments FOR DELETE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);
```

### Tabela: messages
```sql
-- Visualizar (próprias mensagens)
CREATE POLICY "Allow users to view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- Enviar
CREATE POLICY "Allow authenticated users to send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Atualizar
CREATE POLICY "Allow users to update their messages"
  ON messages FOR UPDATE
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id)
  WITH CHECK (auth.uid() = sender_id OR auth.uid() = recipient_id);
```

### Tabela: documents
```sql
-- Visualizar (próprios documentos)
CREATE POLICY "Allow users to view their documents"
  ON documents FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

-- Criar (terapeuta cria)
CREATE POLICY "Allow therapists to create documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);

-- Atualizar
CREATE POLICY "Allow therapists to update their documents"
  ON documents FOR UPDATE
  USING (auth.uid() = therapist_id)
  WITH CHECK (auth.uid() = therapist_id);

-- Deletar
CREATE POLICY "Allow therapists to delete their documents"
  ON documents FOR DELETE
  USING (auth.uid() = therapist_id);
```

---

## ✅ Checklist

- [ ] Abrir SQL Editor no Supabase
- [ ] Copiar `SUPABASE_RLS_FIX.sql`
- [ ] Colar no SQL Editor
- [ ] Executar (Run)
- [ ] Reiniciar navegador (F5)
- [ ] Tentar cadastro novamente
- [ ] Verificar se usuário aparece no Supabase

---

## 🧪 Testar

### Teste 1: Cadastro
```
Email: novo2@example.com
CPF: 11111111111
Nome: Novo Usuário 2
Telefone: 11987654321
Perfil: Paciente
```

**Resultado esperado**: ✅ Cadastro bem-sucedido

### Teste 2: Verificar no Supabase
1. Abra: https://app.supabase.com
2. Table Editor → users
3. Procure pelo novo usuário

**Resultado esperado**: ✅ Usuário aparece na tabela

### Teste 3: Login
```
Email: novo2@example.com
Senha: (a mesma que cadastrou)
```

**Resultado esperado**: ✅ Login bem-sucedido

---

## 🚨 Se Ainda Não Funcionar

### Opção 1: Verificar RLS Status
1. Abra: https://app.supabase.com
2. Clique em: **Table Editor**
3. Selecione: **users**
4. Clique em: **RLS** (canto superior direito)
5. Verifique se está **habilitado** (deve estar verde)

### Opção 2: Verificar Políticas
1. Abra: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Execute:

```sql
SELECT * FROM pg_policies WHERE tablename = 'users';
```

**Resultado esperado**: Deve listar as 3 políticas

### Opção 3: Desabilitar RLS Temporariamente
⚠️ **APENAS PARA TESTE** (não fazer em produção!)

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
```

Depois de testar, reabilitar:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

---

## 📞 Troubleshooting

### Erro: "Policy already exists"
**Solução**: As políticas antigas ainda existem. Execute o SQL que as remove primeiro.

### Erro: "Column id does not exist"
**Solução**: Verificar se a tabela `users` tem a coluna `id`. Deve ter.

### Erro: "auth.uid() is not defined"
**Solução**: Isso é normal. Supabase entende `auth.uid()` automaticamente.

---

## 🎉 Pronto!

Após executar o SQL, o cadastro deve funcionar perfeitamente! 🚀

---

**Última atualização**: 20 de Novembro de 2025
**Status**: ✅ Solução Pronta
