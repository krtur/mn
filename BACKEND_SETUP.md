# 🚀 Guia de Setup do Backend

## 📋 Visão Geral

Este guia descreve como criar um backend Node.js + Express para integração com o frontend.

---

## 🛠️ Pré-requisitos

- Node.js 18+ instalado
- npm ou yarn
- MongoDB instalado localmente ou conta MongoDB Atlas
- Postman (para testar endpoints)

---

## 📦 Criar Novo Projeto Backend

### 1. Criar pasta do projeto

```bash
mkdir mn-backend
cd mn-backend
```

### 2. Inicializar npm

```bash
npm init -y
```

### 3. Instalar dependências

```bash
npm install express cors dotenv mongoose bcryptjs jsonwebtoken
npm install --save-dev nodemon typescript @types/node @types/express
```

### 4. Criar estrutura de pastas

```bash
mkdir src
mkdir src/routes
mkdir src/controllers
mkdir src/models
mkdir src/middleware
mkdir src/utils
```

---

## 📝 Arquivos Necessários

### 1. `.env` - Variáveis de Ambiente

```env
PORT=3001
MONGODB_URI=mongodb://localhost:27017/mn-terapeutas
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRE=7d
NODE_ENV=development
```

### 2. `package.json` - Atualizar scripts

```json
{
  "scripts": {
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### 3. `tsconfig.json` - Configuração TypeScript

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules"]
}
```

---

## 💻 Código Base

### `src/index.ts` - Servidor Principal

```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Conectar MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mn-terapeutas')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Erro ao conectar MongoDB:', err));

// Rotas (serão adicionadas)
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/messages', require('./routes/messages'));
app.use('/api/documents', require('./routes/documents'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
```

### `src/models/User.ts` - Model de Usuário

```typescript
import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  cpf: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['patient', 'therapist_a', 'therapist_b'],
    required: true,
  },
  profileImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash de senha antes de salvar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(password: string) {
  return bcryptjs.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
```

### `src/routes/auth.ts` - Rotas de Autenticação

```typescript
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Buscar usuário
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Verificar senha
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao fazer login', error });
  }
});

// Registro
router.post('/register', async (req, res) => {
  try {
    const { email, cpf, name, phone, password, role } = req.body;

    // Validar entrada
    if (!email || !cpf || !name || !phone || !password || !role) {
      return res.status(400).json({ message: 'Todos os campos são obrigatórios' });
    }

    // Verificar se usuário já existe
    const existingUser = await User.findOne({ $or: [{ email }, { cpf }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou CPF já cadastrado' });
    }

    // Criar novo usuário
    const user = new User({
      email,
      cpf,
      name,
      phone,
      password,
      role,
    });

    await user.save();

    // Gerar token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        cpf: user.cpf,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao cadastrar usuário', error });
  }
});

export default router;
```

---

## 🔐 Middleware de Autenticação

### `src/middleware/auth.ts`

```typescript
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export interface AuthRequest extends Request {
  userId?: string;
  role?: string;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as any;
    req.userId = decoded.userId;
    req.role = decoded.role;

    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.role || !roles.includes(req.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }
    next();
  };
};
```

---

## 🚀 Iniciar Backend

### 1. Instalar MongoDB localmente (opcional)

Se preferir usar MongoDB Atlas (cloud):
1. Criar conta em https://www.mongodb.com/cloud/atlas
2. Criar cluster gratuito
3. Copiar connection string
4. Adicionar em `.env`

### 2. Rodar servidor

```bash
npm run dev
```

Você verá:
```
✅ MongoDB conectado
🚀 Servidor rodando em http://localhost:3001
```

### 3. Testar com Postman

**POST** `http://localhost:3001/api/auth/register`
```json
{
  "email": "joao@example.com",
  "cpf": "123.456.789-00",
  "name": "João Silva",
  "phone": "(11) 99999-9999",
  "password": "senha123",
  "role": "patient"
}
```

**POST** `http://localhost:3001/api/auth/login`
```json
{
  "email": "joao@example.com",
  "password": "senha123"
}
```

---

## 🔗 Conectar Frontend com Backend

### 1. Atualizar `.env.local` do frontend

```env
VITE_API_URL=http://localhost:3001/api
```

### 2. Usar serviço de API

```typescript
import { api } from './services/api';

// Login
const response = await api.auth.login(email, password);
sessionStorage.setItem('token', response.token);
```

---

## 📚 Próximos Endpoints

Implemente os seguintes endpoints:

### Agendamentos
- `GET /api/appointments` - Listar
- `POST /api/appointments` - Criar
- `PUT /api/appointments/:id` - Atualizar
- `DELETE /api/appointments/:id` - Deletar

### Mensagens
- `GET /api/messages` - Listar
- `POST /api/messages` - Enviar
- `PUT /api/messages/:id/read` - Marcar como lida

### Documentos
- `GET /api/documents` - Listar
- `POST /api/documents` - Criar
- `GET /api/documents/:id/download` - Download

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'express'"
```bash
npm install
```

### Erro: "MongoDB connection failed"
- Verificar se MongoDB está rodando
- Verificar connection string em `.env`

### Erro: "CORS error"
Adicionar em `src/index.ts`:
```typescript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
```

---

## 📦 Deploy Backend

### Opção 1: Railway (Recomendado)
1. Criar conta em https://railway.app
2. Conectar repositório GitHub
3. Adicionar variáveis de ambiente
4. Deploy automático

### Opção 2: Render
1. Criar conta em https://render.com
2. Criar novo Web Service
3. Conectar repositório
4. Deploy

### Opção 3: Heroku
```bash
npm install -g heroku
heroku login
heroku create seu-app-name
git push heroku main
```

---

## ✅ Checklist

- [ ] Node.js 18+ instalado
- [ ] MongoDB configurado
- [ ] Projeto criado
- [ ] Dependências instaladas
- [ ] Variáveis de ambiente configuradas
- [ ] Servidor rodando
- [ ] Endpoints testados
- [ ] Frontend conectado
- [ ] Deploy configurado

---

**Próximo passo**: Implementar os endpoints restantes conforme necessário.

---

**Última atualização**: 20 de Novembro de 2025
