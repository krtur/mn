# 🎯 Supabase Setup - Guia Visual Passo a Passo

**Status**: ✅ Credenciais Configuradas | ⏳ Tabelas Pendentes

---

## ✅ Passo 1: Credenciais Configuradas ✓

Suas credenciais já foram adicionadas em `.env.local`:

```env
VITE_SUPABASE_URL=https://ygfxloachqjeslciyunr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ **Pronto!**

---

## ⏳ Passo 2: Criar Tabelas (5 minutos)

### 2.1 Abrir SQL Editor

1. Acesse: https://app.supabase.com
2. Selecione seu projeto
3. Clique em **"SQL Editor"** (lado esquerdo)
4. Clique em **"New Query"**

### 2.2 Copiar e Colar SQL

1. Abra o arquivo: `SUPABASE_SQL_SETUP.sql`
2. Copie TODO o conteúdo (Ctrl+A, Ctrl+C)
3. Cole no SQL Editor do Supabase (Ctrl+V)
4. Clique em **"Run"** (botão azul)

**Resultado esperado**:
```
✓ CREATE TABLE users
✓ CREATE TABLE appointments
✓ CREATE TABLE messages
✓ CREATE TABLE documents
✓ CREATE FUNCTION update_updated_at_column
✓ CREATE TRIGGER update_users_updated_at
... (mais triggers)
```

✅ **Pronto!**

---

## ⏳ Passo 3: Instalar Dependência (2 minutos)

### 3.1 Verificar Instalação

Abra o terminal e execute:

```bash
npm install @supabase/supabase-js
```

**Resultado esperado**:
```
added 5 packages, and audited 50 packages in 2s
```

✅ **Pronto!**

---

## ⏳ Passo 4: Testar Frontend (5 minutos)

### 4.1 Reiniciar Servidor

```bash
npm run dev
```

**Resultado esperado**:
```
  VITE v6.2.0  ready in 123 ms

  ➜  Local:   http://localhost:3000/
```

### 4.2 Abrir no Navegador

1. Abra: http://localhost:3000
2. Clique em **"Não tem conta? Cadastre-se"**
3. Preencha os dados:
   - Email: teste@example.com
   - CPF: 12345678901
   - Nome: Teste Silva
   - Telefone: 11999999999
   - Perfil: Paciente
4. Clique em **"Cadastrar"**

**Resultado esperado**:
```
✓ Usuário criado
✓ Redirecionado para dashboard
✓ Nome aparece no topo
```

### 4.3 Verificar no Supabase

1. Abra: https://app.supabase.com
2. Clique em **"Table Editor"** (lado esquerdo)
3. Selecione tabela **"users"**
4. Verifique se seu usuário aparece

**Resultado esperado**:
```
id: (UUID)
email: teste@example.com
cpf: 12345678901
name: Teste Silva
phone: 11999999999
role: patient
created_at: 2025-11-20 20:57:00
```

✅ **Pronto!**

---

## 🎯 Checklist de Conclusão

- [x] Credenciais configuradas em `.env.local`
- [ ] Dependência `@supabase/supabase-js` instalada
- [ ] Tabelas criadas no Supabase (SQL)
- [ ] Servidor reiniciado (`npm run dev`)
- [ ] Cadastro testado
- [ ] Usuário aparece no Supabase
- [ ] Login funcionando
- [ ] Dashboard carregando

---

## 🧪 Testes Adicionais

### Teste 1: Login

1. Fazer logout (clique no seu nome → Logout)
2. Clique em **"Entrar"**
3. Preencha:
   - Email: teste@example.com
   - Senha: (a mesma que cadastrou)
4. Clique em **"Entrar"**

**Resultado esperado**:
```
✓ Login bem-sucedido
✓ Redirecionado para dashboard
✓ Dados do usuário carregados
```

### Teste 2: Agendamentos

1. No dashboard, clique em **"Agendamentos"**
2. Clique em **"Novo Agendamento"**
3. Preencha os dados
4. Clique em **"Agendar"**

**Resultado esperado**:
```
✓ Agendamento criado
✓ Aparece na lista
✓ Dados salvos no Supabase
```

### Teste 3: Mensagens

1. No dashboard, clique em **"Mensagens"**
2. Selecione um terapeuta
3. Digite uma mensagem
4. Clique em **"Enviar"**

**Resultado esperado**:
```
✓ Mensagem enviada
✓ Aparece no chat
✓ Dados salvos no Supabase
```

---

## 🚨 Troubleshooting

### Erro: "Cannot find module '@supabase/supabase-js'"

**Solução**:
```bash
npm install @supabase/supabase-js
npm run dev
```

### Erro: "RLS policy violation"

**Solução**: Verificar se as políticas RLS foram criadas corretamente. Execute o SQL novamente.

### Erro: "CORS error"

**Solução**: 
1. Abra https://app.supabase.com
2. Clique em **"Settings"** → **"API"**
3. Verifique se `http://localhost:3000` está em **"CORS allowed origins"**

### Cadastro não funciona

**Solução**:
1. Abra o console (F12)
2. Verifique se há erros
3. Verifique se as credenciais estão corretas em `.env.local`
4. Reinicie o servidor

---

## 📊 Estrutura de Dados

### Tabela: users
```
id (UUID)
email (TEXT)
cpf (TEXT)
name (TEXT)
phone (TEXT)
role (TEXT: patient, therapist_a, therapist_b)
profile_image (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabela: appointments
```
id (UUID)
patient_id (UUID → users.id)
therapist_id (UUID → users.id)
start_time (TIMESTAMP)
end_time (TIMESTAMP)
status (TEXT: pending, confirmed, cancelled)
notes (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabela: messages
```
id (UUID)
sender_id (UUID → users.id)
recipient_id (UUID → users.id)
content (TEXT)
read (BOOLEAN)
created_at (TIMESTAMP)
```

### Tabela: documents
```
id (UUID)
patient_id (UUID → users.id)
therapist_id (UUID → users.id)
type (TEXT: report, diagnosis, progress_note)
title (TEXT)
content (TEXT)
file_url (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

---

## 🎉 Próximos Passos

Após completar todos os testes:

1. ✅ Testar todas as funcionalidades
2. ✅ Verificar dados no Supabase
3. ✅ Criar mais usuários de teste
4. ✅ Testar com múltiplos usuários
5. ⏳ Deploy em produção (Netlify)

---

## 📞 Precisa de Ajuda?

1. Consulte `SUPABASE_SETUP.md` (documentação completa)
2. Verifique o console (F12) para erros
3. Verifique os logs do Supabase
4. Teste cada funcionalidade isoladamente

---

## ✅ Status Final

```
Credenciais:     ✅ Configuradas
Dependência:     ⏳ Instalando...
Tabelas:         ⏳ Pendente (execute SQL)
Frontend:        ✅ Pronto
Testes:          ⏳ Pendente
Deploy:          ⏳ Próximo
```

---

**Tempo Total**: ~15 minutos
**Dificuldade**: Muito Fácil
**Status**: ✅ Quase Pronto!

Próximo passo: Execute o SQL no Supabase! 🚀

---

**Última atualização**: 20 de Novembro de 2025
