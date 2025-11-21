# Guia de Configuração - Portal do Usuário

## 🚀 Instalação Rápida

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

---

## 📱 Acessando o Portal

### URLs Principais
- **Home**: `http://localhost:5173/`
- **Login**: `http://localhost:5173/login`
- **Cadastro**: `http://localhost:5173/register`
- **Dashboard**: `http://localhost:5173/dashboard` (requer autenticação)

---

## 🔐 Testando a Autenticação

### Credenciais de Teste

#### Paciente
- **Email**: qualquer email
- **Senha**: qualquer senha
- **Tipo**: Selecionar "Paciente" no cadastro

#### Terapeuta A
- **Email**: qualquer email
- **Senha**: qualquer senha
- **Tipo**: Selecionar "Terapeuta A" no cadastro

#### Terapeuta B
- **Email**: qualquer email
- **Senha**: qualquer senha
- **Tipo**: Selecionar "Terapeuta B" no cadastro

**Nota**: O sistema atual usa autenticação simulada. Integrar com API real quando disponível.

---

## 📊 Estrutura do Dashboard

### Dashboard do Paciente
Acesso: `/dashboard` (quando logado como Paciente)

**Menu Lateral**:
- 📅 Dashboard
- 📅 Agendamentos
- 💬 Mensagens
- 📄 Relatórios
- 🛒 Loja de Testes
- 📊 Histórico
- 👤 Perfil

**Funcionalidades**:
1. **Agendamentos**: Visualizar, agendar, reagendar e cancelar sessões
2. **Mensagens**: Chat privado com terapeuta
3. **Relatórios**: Download de documentos emitidos
4. **Loja de Testes**: Comprar testes com carrinho
5. **Histórico**: Ver sessões realizadas
6. **Perfil**: Editar dados pessoais

### Dashboard do Terapeuta
Acesso: `/dashboard` (quando logado como Terapeuta A ou B)

**Menu Lateral**:
- 📅 Dashboard
- 📅 Agenda
- 👥 Pacientes
- 💬 Mensagens
- 📄 Documentos
- 👤 Perfil

**Funcionalidades**:
1. **Agenda**: Gerenciar agendamentos de pacientes
2. **Pacientes**: Lista com busca e filtros
3. **Mensagens**: Responder mensagens de pacientes
4. **Documentos**: Gerar relatórios e documentos
5. **Perfil**: Gerenciar dados profissionais

---

## 🔄 Fluxo de Navegação

### Novo Usuário
```
Home → Cadastro → Login → Dashboard
```

### Usuário Existente
```
Home → Login → Dashboard
```

### Logout
```
Dashboard → Clique em "Sair" → Home
```

---

## 🎨 Customização

### Cores
Editar em `tailwind.config.js`:
```javascript
colors: {
  teal: '#0d9488',    // Cor primária
  slate: '#...',      // Cor secundária
  // ...
}
```

### Fontes
Editar em `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'sans-serif'],
  // ...
}
```

### Componentes
Editar em `index.css`:
```css
@layer components {
  .btn-primary {
    @apply bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors;
  }
}
```

---

## 🔧 Variáveis de Ambiente

Criar arquivo `.env.local`:
```env
# API
VITE_API_URL=http://localhost:3000/api

# Autenticação
VITE_AUTH_TOKEN_KEY=auth_token

# Outros
VITE_APP_NAME=M&N Terapeutas
```

---

## 📝 Estrutura de Arquivos

```
components/
├── auth/
│   ├── AuthContext.tsx        # Context de autenticação
│   ├── Login.tsx              # Página de login
│   ├── Register.tsx           # Página de cadastro
│   └── ProtectedRoute.tsx     # Proteção de rotas
├── dashboard/
│   ├── DashboardLayout.tsx    # Layout principal
│   ├── Sidebar.tsx            # Menu lateral
│   └── TopBar.tsx             # Barra superior
├── patient/                   # Componentes do paciente
│   ├── PatientDashboard.tsx
│   ├── Appointments.tsx
│   ├── Messages.tsx
│   ├── Reports.tsx
│   ├── TestShop.tsx
│   ├── AttendanceHistory.tsx
│   └── Profile.tsx
└── therapist/                 # Componentes do terapeuta
    ├── TherapistDashboard.tsx
    ├── Schedule.tsx
    ├── PatientList.tsx
    ├── Messages.tsx
    ├── DocumentGeneration.tsx
    └── Profile.tsx
```

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'react-router-dom'"
**Solução**: Execute `npm install` novamente

### Erro: "Port 5173 already in use"
**Solução**: Mude a porta em `vite.config.ts`:
```typescript
server: {
  port: 5174
}
```

### Sessão perdida ao recarregar
**Comportamento esperado**: A sessão é armazenada em `sessionStorage` e é perdida ao fechar a aba. Para persistência, implementar localStorage ou cookies.

### Componentes não aparecem
**Solução**: Verificar se os imports estão corretos em `App.tsx`

---

## 🚀 Deploy

### Build para Produção
```bash
npm run build
```

Arquivos gerados em `dist/`

### Preview Local
```bash
npm run preview
```

### Deploy em Netlify
1. Conectar repositório GitHub
2. Build command: `npm run build`
3. Publish directory: `dist`

---

## 📚 Recursos Adicionais

- [React Router Documentation](https://reactrouter.com/)
- [React Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## 💡 Dicas

1. **Usar DevTools**: Instale React DevTools para inspecionar componentes
2. **Testar Responsividade**: Use F12 para abrir DevTools e testar em mobile
3. **Verificar Console**: Abra o console para ver logs e erros
4. **Hot Reload**: Alterações em arquivos são refletidas automaticamente

---

## 📞 Suporte

Para dúvidas ou problemas, consulte:
- ARCHITECTURE.md - Documentação da arquitetura
- IMPLEMENTATION_SUMMARY.md - Resumo da implementação
- Código comentado nos componentes

---

## ✅ Checklist de Configuração

- [ ] Dependências instaladas (`npm install`)
- [ ] Servidor iniciado (`npm run dev`)
- [ ] Acessar `http://localhost:5173`
- [ ] Testar cadastro
- [ ] Testar login
- [ ] Acessar dashboard
- [ ] Testar funcionalidades
- [ ] Verificar console para erros

---

**Última atualização**: 20 de Novembro de 2024
