# Estrutura do Projeto

## 📁 Visão Geral

```
m-n-terapeutas/
├── components/
│   ├── auth/                    # Autenticação
│   ├── dashboard/               # Layout do dashboard
│   ├── patient/                 # Componentes do paciente
│   ├── therapist/               # Componentes do terapeuta
│   ├── icons/                   # Ícones SVG
│   └── [Componentes existentes]
├── context/                     # Context API
├── public/                      # Arquivos estáticos
├── App.tsx                      # Componente raiz
├── index.tsx                    # Ponto de entrada
├── index.css                    # Estilos globais
├── vite.config.ts              # Configuração Vite
├── tailwind.config.js          # Configuração Tailwind
├── tsconfig.json               # Configuração TypeScript
├── package.json                # Dependências
├── ARCHITECTURE.md             # Documentação da arquitetura
├── IMPLEMENTATION_SUMMARY.md   # Resumo da implementação
├── PORTAL_SETUP.md            # Guia de setup
├── API_INTEGRATION.md         # Integração com API
├── QUICK_START.md             # Quick start
└── PROJECT_STRUCTURE.md       # Este arquivo
```

---

## 🗂️ Estrutura Detalhada

### components/auth/
Componentes de autenticação e proteção de rotas

```
auth/
├── AuthContext.tsx          # Context para gerenciar autenticação
│   ├── useAuth() hook
│   ├── AuthProvider component
│   └── User interface
├── Login.tsx               # Página de login
│   ├── Email/CPF input
│   ├── Password input
│   └── Submit button
├── Register.tsx            # Página de cadastro
│   ├── Profile type selector
│   ├── Form fields
│   └── Submit button
└── ProtectedRoute.tsx      # Proteção de rotas
    ├── Verifica autenticação
    ├── Verifica role
    └── Redireciona se necessário
```

### components/dashboard/
Layout base do dashboard

```
dashboard/
├── DashboardLayout.tsx     # Layout principal
│   ├── Sidebar
│   ├── TopBar
│   └── Outlet (rotas aninhadas)
├── Sidebar.tsx            # Menu lateral
│   ├── Menu items
│   ├── Toggle button
│   └── Logout button
└── TopBar.tsx             # Barra superior
    ├── Menu toggle
    ├── User info
    └── Logout button
```

### components/patient/
Componentes específicos do paciente

```
patient/
├── PatientDashboard.tsx    # Dashboard principal
│   ├── Quick stats
│   ├── Próximos agendamentos
│   └── Ações rápidas
├── Appointments.tsx        # Gerenciamento de agendamentos
│   ├── Lista de agendamentos
│   ├── Novo agendamento form
│   └── Ações (reagendar, cancelar)
├── Messages.tsx           # Sistema de mensagens
│   ├── Lista de conversas
│   ├── Chat thread
│   └── Input de mensagem
├── Reports.tsx            # Visualização de relatórios
│   ├── Lista de documentos
│   ├── Download button
│   └── Filtros
├── TestShop.tsx           # Loja de testes
│   ├── Catálogo de testes
│   ├── Carrinho de compras
│   └── Checkout
├── AttendanceHistory.tsx  # Histórico de atendimentos
│   ├── Estatísticas
│   └── Lista de sessões
└── Profile.tsx            # Gerenciamento de perfil
    ├── Dados pessoais
    ├── Edição de perfil
    └── Segurança
```

### components/therapist/
Componentes específicos do terapeuta

```
therapist/
├── TherapistDashboard.tsx  # Dashboard principal
│   ├── Quick stats
│   ├── Agendamentos de hoje
│   └── Ações rápidas
├── Schedule.tsx           # Agenda consolidada
│   ├── Lista de agendamentos
│   ├── Filtros
│   └── Ações (confirmar, reagendar, cancelar)
├── PatientList.tsx        # Lista de pacientes
│   ├── Tabela de pacientes
│   ├── Busca e filtros
│   └── Ações (ver, editar)
├── Messages.tsx           # Caixa de mensagens
│   ├── Lista de conversas
│   ├── Chat thread
│   └── Input de mensagem
├── DocumentGeneration.tsx # Geração de documentos
│   ├── Formulário de documento
│   ├── Editor de texto
│   ├── Templates
│   └── Botões (gerar, salvar rascunho)
└── Profile.tsx            # Gerenciamento de perfil
    ├── Dados profissionais
    ├── Credenciais
    ├── Edição de perfil
    └── Segurança
```

### components/icons/
Ícones SVG reutilizáveis

```
icons/
├── WhatsappIcon.tsx
├── InstagramIcon.tsx
├── AcademicCapIcon.tsx
├── BadgeCheckIcon.tsx
├── BoltIcon.tsx
└── [+16 outros ícones]
```

### components/ (Existentes)
Componentes da página pública

```
├── Header.tsx              # Cabeçalho com navegação
├── Footer.tsx              # Rodapé
├── HeroSection.tsx         # Seção principal
├── Navbar.tsx              # Barra de navegação
├── TerapiaCorporativa.tsx
├── ProjetoEscola.tsx
├── TerapiaBaixoCusto.tsx
├── Mentoria.tsx
├── MeuAtendimento.tsx
├── Credenciais.tsx
├── Depoimentos.tsx
├── OQueETrg.tsx
├── Faq.tsx
├── Frases.tsx
├── Fobias.tsx
├── Ebooks.tsx
├── Chatbot.tsx
└── chatbotData.ts
```

### context/
Context API para estado global

```
context/
└── LanguageContext.tsx     # Contexto de idioma (existente)
```

### public/
Arquivos estáticos

```
public/
├── logo.png
├── marcelo.png
├── nadielma.png
├── marcelo-credential.png
├── nadielma-credential.png
└── [+3 outras imagens]
```

---

## 📄 Arquivos de Configuração

### Raiz do Projeto

```
.env.example               # Exemplo de variáveis de ambiente
.gitignore                # Arquivos ignorados pelo Git
.prettierrc.json          # Configuração Prettier
eslint.config.js          # Configuração ESLint
package.json              # Dependências e scripts
package-lock.json         # Lock file
postcss.config.js         # Configuração PostCSS
tailwind.config.js        # Configuração Tailwind CSS
tsconfig.json             # Configuração TypeScript
vite.config.ts            # Configuração Vite
index.html                # Template HTML
index.css                 # Estilos globais
index.tsx                 # Ponto de entrada React
App.tsx                   # Componente raiz com Router
```

---

## 📚 Documentação

```
ARCHITECTURE.md            # Documentação completa da arquitetura
IMPLEMENTATION_SUMMARY.md  # Resumo da implementação
PORTAL_SETUP.md           # Guia de configuração e setup
API_INTEGRATION.md        # Guia de integração com API
QUICK_START.md            # Quick start em 3 passos
PROJECT_STRUCTURE.md      # Este arquivo
LICENSE                   # Licença MIT
README.md                 # Documentação principal
CONTRIBUTING.md           # Guia de contribuição
```

---

## 🔄 Fluxo de Dados

### Autenticação
```
Login/Register → AuthContext → sessionStorage → ProtectedRoute → Dashboard
```

### Navegação
```
App.tsx (Router)
├── Public Routes
│   └── PublicLayout
└── Protected Routes
    └── DashboardLayout
        ├── Sidebar (navegação)
        ├── TopBar (logout)
        └── Outlet (componentes específicos)
```

### Estado Global
```
AuthContext
├── user (dados do usuário)
├── isAuthenticated (boolean)
├── isLoading (boolean)
├── login() (função)
├── register() (função)
└── logout() (função)
```

---

## 🎯 Componentes por Funcionalidade

### Autenticação
- `AuthContext.tsx` - Gerenciamento de autenticação
- `Login.tsx` - Página de login
- `Register.tsx` - Página de cadastro
- `ProtectedRoute.tsx` - Proteção de rotas

### Dashboard Base
- `DashboardLayout.tsx` - Layout principal
- `Sidebar.tsx` - Menu lateral
- `TopBar.tsx` - Barra superior

### Paciente (7 componentes)
- `PatientDashboard.tsx` - Dashboard principal
- `Appointments.tsx` - Agendamentos
- `Messages.tsx` - Mensagens
- `Reports.tsx` - Relatórios
- `TestShop.tsx` - Loja de testes
- `AttendanceHistory.tsx` - Histórico
- `Profile.tsx` - Perfil

### Terapeuta (6 componentes)
- `TherapistDashboard.tsx` - Dashboard principal
- `Schedule.tsx` - Agenda
- `PatientList.tsx` - Pacientes
- `Messages.tsx` - Mensagens
- `DocumentGeneration.tsx` - Documentos
- `Profile.tsx` - Perfil

---

## 📊 Estatísticas

| Métrica | Valor |
|---------|-------|
| Componentes criados | 26 |
| Linhas de código | ~3000 |
| Arquivos de documentação | 6 |
| Rotas implementadas | 20+ |
| Funcionalidades | 7 principais |
| Papéis de usuário | 3 |

---

## 🚀 Próximas Adições

### Curto Prazo
- [ ] Serviço de API (`services/api.ts`)
- [ ] Hooks customizados (`hooks/`)
- [ ] Tipos TypeScript (`types/`)
- [ ] Utilitários (`utils/`)

### Médio Prazo
- [ ] Testes unitários (`__tests__/`)
- [ ] Testes E2E (`e2e/`)
- [ ] Componentes compartilhados (`components/shared/`)
- [ ] Estilos customizados (`styles/`)

### Longo Prazo
- [ ] Internacionalização (`i18n/`)
- [ ] Temas (`themes/`)
- [ ] Configurações (`config/`)
- [ ] Constantes (`constants/`)

---

## 🔗 Dependências

### Principais
- `react@19.2.0` - UI Framework
- `react-dom@19.2.0` - React DOM
- `react-router-dom@6.20.0` - Roteamento
- `tailwindcss@3.4.0` - Styling

### Dev
- `typescript@5.8.2` - Type Safety
- `vite@6.2.0` - Build tool
- `eslint@8.56.0` - Linting
- `prettier@3.2.0` - Formatting

---

## 📝 Convenções

### Nomenclatura
- **Componentes**: PascalCase (`PatientDashboard.tsx`)
- **Funções**: camelCase (`useAuth()`)
- **Constantes**: UPPER_SNAKE_CASE (`API_URL`)
- **Variáveis**: camelCase (`userName`)

### Estrutura de Componentes
```typescript
// Imports
import React from 'react';

// Interface/Type
interface Props {
  // ...
}

// Componente
export const ComponentName: React.FC<Props> = ({ props }) => {
  // Hooks
  // State
  // Effects
  // Handlers
  // Render
  return (
    // JSX
  );
};
```

### Estilos
- Usar Tailwind CSS classes
- Componentes customizados em `index.css`
- Inline styles apenas quando necessário

---

## ✅ Checklist de Estrutura

- [x] Componentes de autenticação
- [x] Layout do dashboard
- [x] Componentes do paciente
- [x] Componentes do terapeuta
- [x] Roteamento com React Router
- [x] Context API para autenticação
- [x] Documentação completa
- [x] Estilos com Tailwind CSS
- [x] TypeScript configurado
- [x] Componentes responsivos

---

**Última atualização**: 20 de Novembro de 2024
