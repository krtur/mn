# ⚡ Supabase - Quick Start (15 minutos)

**Status**: ✅ Pronto para implementar

---

## 🚀 3 Passos Rápidos

### Passo 1: Criar Conta Supabase (2 min)

```
1. Acesse https://supabase.com
2. Clique em "Start Your Project"
3. Faça login com email ou GitHub
4. Clique em "New Project"
5. Preencha:
   - Nome: mn-terapeutas
   - Região: South America (São Paulo)
   - Senha: Gere uma forte
6. Clique em "Create new project"
```

**Pronto!** Seu banco de dados está criado.

---

### Passo 2: Obter Credenciais (2 min)

```
1. Clique em "Settings" (engrenagem)
2. Clique em "API"
3. Copie:
   - Project URL
   - anon public key
```

**Exemplo**:
```
URL: https://seu-projeto.supabase.co
Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Passo 3: Configurar Frontend (5 min)

#### 3.1 Instalar Supabase
```bash
npm install @supabase/supabase-js
```

#### 3.2 Atualizar `.env.local`
```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3.3 Criar Tabelas (SQL)

Abra "SQL Editor" no Supabase e execute:

```sql
-- Tabela de Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT UNIQUE NOT NULL,
  cpf TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('patient', 'therapist_a', 'therapist_b')),
  profile_image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Agendamentos
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id),
  therapist_id UUID NOT NULL REFERENCES users(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Mensagens
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id),
  recipient_id UUID NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de Documentos
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id),
  therapist_id UUID NOT NULL REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('report', 'diagnosis', 'progress_note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
```

---

## ✅ Pronto!

Seu backend está configurado! Agora:

1. ✅ Supabase criado
2. ✅ Credenciais obtidas
3. ✅ Frontend configurado
4. ✅ Tabelas criadas

---

## 🧪 Testar

### 1. Reiniciar Servidor
```bash
npm run dev
```

### 2. Fazer Cadastro
- Abrir http://localhost:3000
- Clique em "Cadastre-se"
- Preencha os dados
- Clique em "Cadastrar"

### 3. Verificar no Supabase
- Abra https://app.supabase.com
- Clique em "Table Editor"
- Verifique se o usuário foi criado na tabela `users`

---

## 🎯 Próximos Passos

1. ✅ Testar cadastro
2. ✅ Testar login
3. ✅ Testar agendamentos
4. ✅ Testar mensagens
5. ✅ Deploy em produção

---

## 📚 Documentação Completa

Para mais detalhes, leia: `SUPABASE_SETUP.md`

---

**Tempo Total**: ~15 minutos
**Dificuldade**: Muito Fácil
**Status**: ✅ Pronto

Vamos começar? 🚀

---

**Última atualização**: 20 de Novembro de 2025
