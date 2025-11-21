# 🚀 Guia Completo - Supabase Setup

**Data**: 20 de Novembro de 2025
**Status**: ✅ Pronto para implementação

---

## 📋 O Que é Supabase?

Supabase é uma alternativa open-source ao Firebase com:
- ✅ PostgreSQL real (não NoSQL)
- ✅ Autenticação integrada
- ✅ Realtime database
- ✅ Storage de arquivos
- ✅ Funções serverless
- ✅ Plano gratuito generoso

---

## 🎯 Passo 1: Criar Conta Supabase

### 1.1 Acessar Supabase
```
https://supabase.com
```

### 1.2 Clicar em "Start Your Project"
- Clique em "Sign Up"
- Use email ou GitHub

### 1.3 Criar Novo Projeto
- Clique em "New Project"
- Nome: `mn-terapeutas`
- Região: `South America (São Paulo)` (mais próximo)
- Senha do banco: Gere uma forte
- Clique em "Create new project"

**Tempo**: ~2 minutos
**Checklist**:
- [ ] Conta criada
- [ ] Projeto criado
- [ ] Banco de dados inicializado

---

## 🔑 Passo 2: Obter Credenciais

### 2.1 Acessar Settings
1. Clique em "Settings" (ícone de engrenagem)
2. Clique em "API"

### 2.2 Copiar Credenciais
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Checklist**:
- [ ] URL copiada
- [ ] Anon key copiada
- [ ] Service key copiada (guardar seguro!)

---

## 📦 Passo 3: Instalar Supabase no Frontend

### 3.1 Instalar Biblioteca
```bash
npm install @supabase/supabase-js
```

### 3.2 Criar Arquivo de Configuração

**Arquivo**: `c:\Users\Matheus\OneDrive\Documentos\Projetos\mn\services\supabase.ts`

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export type Database = any; // Será gerado automaticamente

// Funções auxiliares
export const supabaseAuth = supabase.auth;
export const supabaseDB = supabase.from;
```

**Checklist**:
- [ ] Biblioteca instalada
- [ ] Arquivo criado
- [ ] Configuração adicionada

---

## 🔐 Passo 4: Configurar Variáveis de Ambiente

### 4.1 Atualizar `.env.local`

```env
# Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Checklist**:
- [ ] `.env.local` atualizado
- [ ] URL correta
- [ ] Anon key correta

---

## 🗄️ Passo 5: Criar Tabelas no Supabase

### 5.1 Acessar SQL Editor
1. Clique em "SQL Editor"
2. Clique em "New Query"

### 5.2 Criar Tabela de Usuários

```sql
-- Criar tabela users
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

-- Criar índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf);
CREATE INDEX idx_users_role ON users(role);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Política: Usuários podem atualizar seus próprios dados
CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  USING (auth.uid() = id);
```

**Checklist**:
- [ ] Tabela criada
- [ ] Índices criados
- [ ] RLS habilitado

### 5.3 Criar Tabela de Agendamentos

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_therapist ON appointments(therapist_id);
CREATE INDEX idx_appointments_status ON appointments(status);

ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY "Users can view their appointments"
  ON appointments FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Patients can create appointments"
  ON appointments FOR INSERT
  WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Users can update their appointments"
  ON appointments FOR UPDATE
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);
```

**Checklist**:
- [ ] Tabela criada
- [ ] Índices criados
- [ ] RLS habilitado

### 5.4 Criar Tabela de Mensagens

```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_messages_created ON messages(created_at);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their messages"
  ON messages FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (auth.uid() = sender_id);
```

**Checklist**:
- [ ] Tabela criada
- [ ] Índices criados
- [ ] RLS habilitado

### 5.5 Criar Tabela de Documentos

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  therapist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('report', 'diagnosis', 'progress_note')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  file_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_documents_patient ON documents(patient_id);
CREATE INDEX idx_documents_therapist ON documents(therapist_id);
CREATE INDEX idx_documents_type ON documents(type);

ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their documents"
  ON documents FOR SELECT
  USING (auth.uid() = patient_id OR auth.uid() = therapist_id);

CREATE POLICY "Therapists can create documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = therapist_id);
```

**Checklist**:
- [ ] Tabela criada
- [ ] Índices criados
- [ ] RLS habilitado

---

## 🔄 Passo 6: Atualizar AuthContext para Supabase

**Arquivo**: `c:\Users\Matheus\OneDrive\Documentos\Projetos\mn\components\auth\AuthContext.tsx`

```typescript
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, supabaseAuth } from '../../services/supabase';

export type UserRole = 'patient' | 'therapist_a' | 'therapist_b';

export interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: UserRole;
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restaurar sessão ao carregar
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data: { session } } = await supabaseAuth.getSession();
        
        if (session?.user) {
          // Buscar dados do usuário
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data && !error) {
            setUser({
              id: data.id,
              email: data.email,
              name: data.name,
              cpf: data.cpf,
              phone: data.phone,
              role: data.role,
              profileImage: data.profile_image,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            });
          }
        }
      } catch (error) {
        console.error('Erro ao restaurar sessão:', error);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabaseAuth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (data) {
            setUser({
              id: data.id,
              email: data.email,
              name: data.name,
              cpf: data.cpf,
              phone: data.phone,
              role: data.role,
              profileImage: data.profile_image,
              createdAt: new Date(data.created_at),
              updatedAt: new Date(data.updated_at),
            });
          }
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabaseAuth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { password: string }) => {
    setIsLoading(true);
    try {
      // Criar usuário no Auth
      const { data: authData, error: authError } = await supabaseAuth.signUp({
        email: userData.email,
        password: userData.password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Criar registro do usuário
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

        if (dbError) throw dbError;

        setUser({
          id: authData.user.id,
          email: userData.email,
          name: userData.name,
          cpf: userData.cpf,
          phone: userData.phone,
          role: userData.role,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabaseAuth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};
```

**Checklist**:
- [ ] Arquivo atualizado
- [ ] Imports corretos
- [ ] Funções implementadas

---

## 🔌 Passo 7: Atualizar Serviço de API

**Arquivo**: `c:\Users\Matheus\OneDrive\Documentos\Projetos\mn\services\supabase-api.ts`

```typescript
import { supabase } from './supabase';

// ==================== AGENDAMENTOS ====================

export const appointmentAPI = {
  async list(filters?: { patientId?: string; therapistId?: string; status?: string }) {
    let query = supabase.from('appointments').select('*');

    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }
    if (filters?.therapistId) {
      query = query.eq('therapist_id', filters.therapistId);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('start_time', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(data: {
    patientId: string;
    therapistId: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }) {
    const { data: result, error } = await supabase
      .from('appointments')
      .insert([
        {
          patient_id: data.patientId,
          therapist_id: data.therapistId,
          start_time: data.startTime,
          end_time: data.endTime,
          notes: data.notes,
          status: 'pending',
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  async update(id: string, data: any) {
    const { data: result, error } = await supabase
      .from('appointments')
      .update(data)
      .eq('id', id)
      .select();

    if (error) throw error;
    return result?.[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ==================== MENSAGENS ====================

export const messageAPI = {
  async list(conversationWith: string, limit = 50) {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .or(`and(sender_id.eq.${conversationWith},recipient_id.eq.${conversationWith}),and(sender_id.eq.${conversationWith},recipient_id.eq.${conversationWith})`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  },

  async send(data: { recipientId: string; content: string }) {
    const { data: result, error } = await supabase
      .from('messages')
      .insert([
        {
          recipient_id: data.recipientId,
          content: data.content,
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  async markAsRead(messageId: string) {
    const { error } = await supabase
      .from('messages')
      .update({ read: true })
      .eq('id', messageId);

    if (error) throw error;
  },
};

// ==================== DOCUMENTOS ====================

export const documentAPI = {
  async list(filters?: { patientId?: string; type?: string }) {
    let query = supabase.from('documents').select('*');

    if (filters?.patientId) {
      query = query.eq('patient_id', filters.patientId);
    }
    if (filters?.type) {
      query = query.eq('type', filters.type);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(data: {
    patientId: string;
    type: 'report' | 'diagnosis' | 'progress_note';
    title: string;
    content: string;
  }) {
    const { data: result, error } = await supabase
      .from('documents')
      .insert([
        {
          patient_id: data.patientId,
          type: data.type,
          title: data.title,
          content: data.content,
        },
      ])
      .select();

    if (error) throw error;
    return result?.[0];
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// ==================== USUÁRIOS ====================

export const userAPI = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  },

  async updateProfile(userId: string, data: any) {
    const { data: result, error } = await supabase
      .from('users')
      .update(data)
      .eq('id', userId)
      .select();

    if (error) throw error;
    return result?.[0];
  },
};
```

**Checklist**:
- [ ] Arquivo criado
- [ ] Funções implementadas
- [ ] Tipos corretos

---

## 🧪 Passo 8: Testar Integração

### 8.1 Atualizar `.env.local`

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 8.2 Instalar Dependência

```bash
npm install @supabase/supabase-js
```

### 8.3 Testar no Navegador

1. Abrir http://localhost:3000
2. Fazer cadastro
3. Verificar se usuário foi criado no Supabase
4. Fazer login
5. Testar funcionalidades

**Checklist**:
- [ ] Cadastro funcionando
- [ ] Login funcionando
- [ ] Dados salvos no Supabase
- [ ] Sem erros no console

---

## 🔄 Passo 9: Implementar Funcionalidades

### 9.1 Agendamentos

Atualizar `components/patient/Appointments.tsx`:

```typescript
import { appointmentAPI } from '../../services/supabase-api';
import { useAuth } from '../auth/AuthContext';

export const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await appointmentAPI.list({ patientId: user?.id });
        setAppointments(data);
      } catch (error) {
        console.error('Erro ao carregar agendamentos:', error);
      }
    };

    if (user) {
      loadAppointments();
    }
  }, [user]);

  // ... resto do componente
};
```

### 9.2 Mensagens

Atualizar `components/patient/Messages.tsx`:

```typescript
import { messageAPI } from '../../services/supabase-api';
import { supabase } from '../../services/supabase';

export const Messages = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!user) return;

    // Escutar mensagens em tempo real
    const subscription = supabase
      .from('messages')
      .on('*', (payload) => {
        setMessages((prev) => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  // ... resto do componente
};
```

**Checklist**:
- [ ] Agendamentos funcionando
- [ ] Mensagens funcionando
- [ ] Documentos funcionando
- [ ] Realtime funcionando

---

## 📊 Passo 10: Monitorar e Manter

### 10.1 Acessar Dashboard Supabase

```
https://app.supabase.com
```

### 10.2 Verificar

- ✅ Usuários criados
- ✅ Agendamentos salvos
- ✅ Mensagens sincronizadas
- ✅ Documentos armazenados

### 10.3 Monitorar Performance

- Verificar logs
- Monitorar uso de banco de dados
- Verificar quotas

**Checklist**:
- [ ] Dashboard acessível
- [ ] Dados visíveis
- [ ] Sem erros
- [ ] Performance boa

---

## 🚀 Deploy com Supabase

### 11.1 Deploy Frontend (Netlify)

```bash
npm run build
# Conectar Netlify
# Adicionar variáveis de ambiente
```

### 11.2 Supabase Automático

- Supabase já está em produção
- Sem necessidade de deploy adicional
- Apenas manter credenciais seguras

**Checklist**:
- [ ] Frontend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase em produção
- [ ] Tudo funcionando

---

## ✅ Checklist Completo

### Setup Supabase
- [ ] Conta criada
- [ ] Projeto criado
- [ ] Credenciais obtidas
- [ ] Tabelas criadas
- [ ] RLS configurado

### Frontend
- [ ] @supabase/supabase-js instalado
- [ ] services/supabase.ts criado
- [ ] AuthContext atualizado
- [ ] services/supabase-api.ts criado
- [ ] .env.local atualizado

### Testes
- [ ] Cadastro funcionando
- [ ] Login funcionando
- [ ] Agendamentos funcionando
- [ ] Mensagens funcionando
- [ ] Documentos funcionando

### Deploy
- [ ] Frontend deployado
- [ ] Variáveis de ambiente configuradas
- [ ] Supabase em produção
- [ ] Tudo funcionando

---

## 🎯 Próximos Passos

1. ✅ Criar conta Supabase
2. ✅ Criar tabelas
3. ✅ Instalar biblioteca
4. ✅ Atualizar AuthContext
5. ✅ Criar serviço de API
6. ✅ Testar funcionalidades
7. ✅ Deploy em produção

---

## 📞 Troubleshooting

### Erro: "CORS error"
```
Solução: Adicionar URL do frontend em Supabase Settings > API > CORS
```

### Erro: "RLS policy violation"
```
Solução: Verificar políticas de RLS nas tabelas
```

### Erro: "Auth session not found"
```
Solução: Verificar se usuário está autenticado
```

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)
- [Supabase Storage](https://supabase.com/docs/guides/storage)

---

**Tempo Total**: ~1-2 horas
**Dificuldade**: Fácil
**Status**: ✅ Pronto para implementar

Vamos começar? 🚀

---

**Última atualização**: 20 de Novembro de 2025
