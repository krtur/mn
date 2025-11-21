# Guia de Integração com API

## 📋 Visão Geral

Este documento descreve como integrar o Portal do Usuário com uma API backend real.

---

## 🔌 Endpoints Necessários

### Autenticação

#### POST /api/auth/register
Criar nova conta

**Request**:
```json
{
  "name": "João Silva",
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "password": "senha123",
  "role": "patient"
}
```

**Response** (201):
```json
{
  "id": "user-123",
  "email": "joao@example.com",
  "name": "João Silva",
  "role": "patient",
  "message": "Cadastro realizado com sucesso"
}
```

#### POST /api/auth/login
Autenticar usuário

**Request**:
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Response** (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "user-123",
    "email": "joao@example.com",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "phone": "(11) 99999-9999",
    "role": "patient",
    "profileImage": null,
    "createdAt": "2024-11-20T10:00:00Z",
    "updatedAt": "2024-11-20T10:00:00Z"
  }
}
```

#### POST /api/auth/logout
Fazer logout

**Request**: (sem body)

**Response** (200):
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

### Agendamentos

#### GET /api/appointments
Listar agendamentos do usuário

**Query Parameters**:
- `patientId` (opcional) - Filtrar por paciente
- `therapistId` (opcional) - Filtrar por terapeuta
- `status` (opcional) - confirmed, pending, cancelled
- `from` (opcional) - Data inicial (YYYY-MM-DD)
- `to` (opcional) - Data final (YYYY-MM-DD)

**Response** (200):
```json
{
  "data": [
    {
      "id": "apt-123",
      "patientId": "patient-1",
      "therapistId": "therapist-1",
      "startTime": "2024-11-20T14:00:00Z",
      "endTime": "2024-11-20T14:50:00Z",
      "status": "confirmed",
      "notes": "Sessão regular",
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### POST /api/appointments
Criar novo agendamento

**Request**:
```json
{
  "patientId": "patient-1",
  "therapistId": "therapist-1",
  "startTime": "2024-11-27T10:00:00Z",
  "endTime": "2024-11-27T10:50:00Z",
  "notes": "Sessão agendada"
}
```

**Response** (201):
```json
{
  "id": "apt-124",
  "patientId": "patient-1",
  "therapistId": "therapist-1",
  "startTime": "2024-11-27T10:00:00Z",
  "endTime": "2024-11-27T10:50:00Z",
  "status": "pending",
  "notes": "Sessão agendada",
  "createdAt": "2024-11-20T10:00:00Z"
}
```

#### PUT /api/appointments/:id
Atualizar agendamento

**Request**:
```json
{
  "startTime": "2024-11-27T11:00:00Z",
  "endTime": "2024-11-27T11:50:00Z",
  "status": "confirmed"
}
```

**Response** (200): Agendamento atualizado

#### DELETE /api/appointments/:id
Cancelar agendamento

**Response** (200):
```json
{
  "message": "Agendamento cancelado"
}
```

---

### Mensagens

#### GET /api/messages
Listar mensagens

**Query Parameters**:
- `conversationId` (opcional)
- `limit` (padrão: 50)
- `offset` (padrão: 0)

**Response** (200):
```json
{
  "data": [
    {
      "id": "msg-1",
      "senderId": "user-1",
      "recipientId": "user-2",
      "content": "Olá, como você está?",
      "attachments": [],
      "timestamp": "2024-11-20T10:30:00Z",
      "read": true
    }
  ],
  "total": 1
}
```

#### POST /api/messages
Enviar mensagem

**Request**:
```json
{
  "recipientId": "user-2",
  "content": "Olá, como você está?",
  "attachments": []
}
```

**Response** (201):
```json
{
  "id": "msg-2",
  "senderId": "user-1",
  "recipientId": "user-2",
  "content": "Olá, como você está?",
  "attachments": [],
  "timestamp": "2024-11-20T10:35:00Z",
  "read": false
}
```

#### PUT /api/messages/:id/read
Marcar mensagem como lida

**Response** (200):
```json
{
  "message": "Mensagem marcada como lida"
}
```

---

### Documentos

#### GET /api/documents
Listar documentos

**Query Parameters**:
- `patientId` (opcional)
- `type` (opcional) - report, diagnosis, progress_note
- `limit` (padrão: 50)

**Response** (200):
```json
{
  "data": [
    {
      "id": "doc-1",
      "patientId": "patient-1",
      "therapistId": "therapist-1",
      "type": "report",
      "title": "Relatório de Progresso - Novembro",
      "content": "...",
      "fileUrl": "https://...",
      "createdAt": "2024-11-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

#### POST /api/documents
Criar documento

**Request**:
```json
{
  "patientId": "patient-1",
  "type": "report",
  "title": "Relatório de Progresso",
  "content": "..."
}
```

**Response** (201): Documento criado

#### GET /api/documents/:id/download
Download de documento

**Response** (200): Arquivo PDF

---

### Pacientes (Terapeuta)

#### GET /api/therapist/patients
Listar pacientes do terapeuta

**Query Parameters**:
- `search` (opcional) - Buscar por nome ou CPF
- `status` (opcional) - active, inactive, paused
- `limit` (padrão: 50)

**Response** (200):
```json
{
  "data": [
    {
      "id": "patient-1",
      "name": "João Silva",
      "email": "joao@example.com",
      "cpf": "123.456.789-00",
      "phone": "(11) 99999-9999",
      "status": "active",
      "lastSession": "2024-11-13T14:00:00Z",
      "notes": "Paciente responsável"
    }
  ],
  "total": 1
}
```

#### GET /api/therapist/patients/:id
Detalhes do paciente

**Response** (200): Dados completos do paciente

---

### Perfil

#### GET /api/users/me
Obter dados do usuário autenticado

**Response** (200):
```json
{
  "id": "user-123",
  "email": "joao@example.com",
  "name": "João Silva",
  "cpf": "123.456.789-00",
  "phone": "(11) 99999-9999",
  "role": "patient",
  "profileImage": null,
  "createdAt": "2024-11-20T10:00:00Z",
  "updatedAt": "2024-11-20T10:00:00Z"
}
```

#### PUT /api/users/me
Atualizar perfil

**Request**:
```json
{
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "profileImage": "base64-encoded-image"
}
```

**Response** (200): Usuário atualizado

#### PUT /api/users/me/password
Alterar senha

**Request**:
```json
{
  "currentPassword": "senha123",
  "newPassword": "novaSenha123"
}
```

**Response** (200):
```json
{
  "message": "Senha alterada com sucesso"
}
```

---

## 🔐 Autenticação

### Headers Necessários

```
Authorization: Bearer {token}
Content-Type: application/json
```

### Tratamento de Token

1. **Armazenar token** após login em `sessionStorage`
2. **Enviar token** em todas as requisições autenticadas
3. **Renovar token** quando expirar (implementar refresh token)
4. **Remover token** ao fazer logout

---

## 🛠️ Implementação no Frontend

### 1. Criar serviço de API

**services/api.ts**:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    const token = sessionStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  // Auth
  login: (email: string, password: string) =>
    api.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (data: any) =>
    api.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Appointments
  getAppointments: (filters?: any) =>
    api.request('/appointments', { 
      method: 'GET',
      // Adicionar query params se necessário
    }),

  createAppointment: (data: any) =>
    api.request('/appointments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // ... outros métodos
};
```

### 2. Atualizar AuthContext

**components/auth/AuthContext.tsx**:
```typescript
const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await api.login(email, password);
    sessionStorage.setItem('token', response.token);
    sessionStorage.setItem('user', JSON.stringify(response.user));
    setUser(response.user);
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  } finally {
    setIsLoading(false);
  }
};
```

### 3. Usar em Componentes

```typescript
const { user } = useAuth();

useEffect(() => {
  const fetchAppointments = async () => {
    try {
      const data = await api.getAppointments({ patientId: user?.id });
      setAppointments(data.data);
    } catch (error) {
      console.error('Erro ao buscar agendamentos:', error);
    }
  };

  if (user) {
    fetchAppointments();
  }
}, [user]);
```

---

## ⚠️ Tratamento de Erros

### Códigos de Status HTTP

- **200** - OK
- **201** - Created
- **400** - Bad Request
- **401** - Unauthorized (token inválido/expirado)
- **403** - Forbidden (sem permissão)
- **404** - Not Found
- **500** - Server Error

### Exemplo de Tratamento

```typescript
try {
  const data = await api.login(email, password);
} catch (error: any) {
  if (error.status === 401) {
    setError('Email ou senha inválidos');
  } else if (error.status === 400) {
    setError('Dados inválidos');
  } else {
    setError('Erro ao conectar com servidor');
  }
}
```

---

## 🔄 Fluxo de Autenticação

```
1. Usuário acessa /login
2. Preenche formulário
3. Frontend envia POST /auth/login
4. Backend valida credenciais
5. Backend retorna token + user data
6. Frontend armazena token em sessionStorage
7. Frontend redireciona para /dashboard
8. Todas as requisições incluem token no header
```

---

## 📝 Variáveis de Ambiente

**.env.local**:
```env
VITE_API_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_TOKEN_KEY=auth_token
```

---

## ✅ Checklist de Integração

- [ ] Criar serviço de API
- [ ] Atualizar AuthContext
- [ ] Implementar login real
- [ ] Implementar cadastro real
- [ ] Implementar logout
- [ ] Buscar agendamentos
- [ ] Criar agendamento
- [ ] Buscar mensagens
- [ ] Enviar mensagem
- [ ] Buscar documentos
- [ ] Gerar documento
- [ ] Buscar pacientes (Terapeuta)
- [ ] Atualizar perfil
- [ ] Alterar senha
- [ ] Tratamento de erros
- [ ] Testes E2E

---

## 🚀 Próximos Passos

1. Desenvolver backend com endpoints listados
2. Implementar autenticação JWT
3. Configurar banco de dados
4. Integrar serviço de API no frontend
5. Testar fluxos completos
6. Implementar refresh token
7. Adicionar validação no backend
8. Implementar rate limiting

---

**Última atualização**: 20 de Novembro de 2024
