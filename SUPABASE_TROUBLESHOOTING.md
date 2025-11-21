# 🔧 Troubleshooting - Supabase Integration

**Problema**: Cadastro não aparece na tabela do Supabase

---

## ✅ Solução Aplicada

Atualizei o `AuthContext.tsx` para usar o Supabase real em vez de dados mock.

### O Que Mudou

**Antes** (Mock):
```typescript
const register = async (userData) => {
  console.log('Registrando usuário:', userData);
  // Não salvava no banco
};
```

**Depois** (Supabase Real):
```typescript
const register = async (userData) => {
  // 1. Criar usuário no Auth do Supabase
  const { data: authData, error: authError } = await supabaseAuth.signUp({
    email: userData.email,
    password: userData.password,
  });

  // 2. Criar registro na tabela users
  const { error: dbError } = await supabase
    .from('users')
    .insert([
      {
        id: authData.user.id,
        email: userData.email,
        cpf: userData.cpf,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
      },
    ]);
};
```

---

## 🧪 Testar Agora

### Passo 1: Reiniciar Servidor

```bash
npm run dev
```

### Passo 2: Fazer Novo Cadastro

1. Abra: http://localhost:3000
2. Clique em: "Não tem conta? Cadastre-se"
3. Preencha com **NOVOS DADOS** (email diferente):
   - Email: `novo@example.com`
   - CPF: `98765432100`
   - Nome: `Novo Usuário`
   - Telefone: `11988888888`
   - Perfil: `Paciente`
4. Clique em: "Criar Conta"

### Passo 3: Verificar no Supabase

1. Abra: https://app.supabase.com
2. Clique em: **Table Editor**
3. Selecione: **users**
4. Procure pelo novo usuário

**Resultado esperado**:
```
id: (UUID gerado automaticamente)
email: novo@example.com
cpf: 98765432100
name: Novo Usuário
phone: 11988888888
role: patient
created_at: 2025-11-20 21:00:00
updated_at: 2025-11-20 21:00:00
```

---

## 🚨 Se Ainda Não Funcionar

### Erro 1: "RLS policy violation"

**Causa**: Políticas de segurança do Supabase bloqueando inserção

**Solução**:
1. Abra: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Clique em: **New Query**
4. Execute:

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Se necessário, recriar políticas
DROP POLICY IF EXISTS "Authenticated users can insert" ON users;

CREATE POLICY "Authenticated users can insert"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);
```

### Erro 2: "Email already exists"

**Causa**: Email já foi cadastrado antes

**Solução**: Use um email diferente no cadastro

### Erro 3: "CORS error"

**Causa**: Frontend não autorizado a acessar Supabase

**Solução**:
1. Abra: https://app.supabase.com
2. Clique em: **Settings** → **API**
3. Procure por: **CORS allowed origins**
4. Adicione: `http://localhost:3000`
5. Salve

### Erro 4: "Cannot find module '@supabase/supabase-js'"

**Causa**: Dependência não instalada

**Solução**:
```bash
npm install @supabase/supabase-js
npm run dev
```

### Erro 5: "Variáveis de ambiente não configuradas"

**Causa**: `.env.local` não tem as credenciais

**Solução**:
1. Abra: `.env.local`
2. Verifique se tem:
```env
VITE_SUPABASE_URL=https://ygfxloachqjeslciyunr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
3. Se não tiver, adicione
4. Reinicie servidor

---

## 🔍 Debug - Verificar Console

1. Abra o navegador
2. Pressione **F12** (Developer Tools)
3. Clique em: **Console**
4. Faça o cadastro
5. Procure por mensagens de erro

**Exemplo de erro**:
```
Error: RLS policy violation
Error: CORS error
Error: Email already exists
```

---

## 📊 Verificar Dados no Supabase

### Opção 1: Table Editor

1. Abra: https://app.supabase.com
2. Clique em: **Table Editor**
3. Selecione: **users**
4. Veja todos os usuários

### Opção 2: SQL Query

1. Abra: https://app.supabase.com
2. Clique em: **SQL Editor**
3. Execute:

```sql
SELECT * FROM users ORDER BY created_at DESC;
```

### Opção 3: Verificar Auth

1. Abra: https://app.supabase.com
2. Clique em: **Authentication**
3. Clique em: **Users**
4. Veja todos os usuários autenticados

---

## ✅ Checklist de Verificação

- [ ] Servidor rodando (`npm run dev`)
- [ ] `.env.local` com credenciais corretas
- [ ] Dependência instalada (`npm install @supabase/supabase-js`)
- [ ] Tabelas criadas no Supabase
- [ ] RLS habilitado nas tabelas
- [ ] CORS configurado
- [ ] Novo cadastro feito com email diferente
- [ ] Usuário aparece no Supabase
- [ ] Login funcionando
- [ ] Dashboard carregando com dados corretos

---

## 🎯 Próximos Passos

Após confirmar que o cadastro está funcionando:

1. ✅ Testar login
2. ✅ Testar agendamentos
3. ✅ Testar mensagens
4. ✅ Testar documentos
5. ⏳ Deploy em produção

---

## 📞 Precisa de Mais Ajuda?

1. Verifique os logs do Supabase
2. Consulte a documentação: https://supabase.com/docs
3. Verifique o console do navegador (F12)
4. Teste cada funcionalidade isoladamente

---

**Última atualização**: 20 de Novembro de 2025
**Status**: ✅ Supabase Integrado e Pronto
