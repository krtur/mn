# Arquitetura do Projeto

## Visão Geral

M&N Terapeutas é uma aplicação web moderna construída com React, TypeScript e Tailwind CSS. A aplicação segue uma arquitetura de componentes com roteamento baseado em estado.

## Estrutura de Diretórios

```
m-n-terapeutas/
├── components/              # Componentes React reutilizáveis
│   ├── icons/              # Componentes de ícones SVG
│   ├── Header.tsx          # Cabeçalho com navegação
│   ├── Footer.tsx          # Rodapé
│   ├── HeroSection.tsx     # Seção principal
│   ├── Navbar.tsx          # Barra de navegação
│   └── ...                 # Outros componentes de página
├── App.tsx                 # Componente raiz da aplicação
├── index.tsx               # Ponto de entrada React
├── index.html              # Template HTML
├── index.css               # Estilos globais (Tailwind)
├── vite.config.ts          # Configuração Vite
├── tailwind.config.js      # Configuração Tailwind CSS
├── tsconfig.json           # Configuração TypeScript
├── eslint.config.js        # Configuração ESLint
├── postcss.config.js       # Configuração PostCSS
├── .prettierrc.json        # Configuração Prettier
├── .env.example            # Exemplo de variáveis de ambiente
├── package.json            # Dependências do projeto
├── LICENSE                 # Licença MIT
├── README.md               # Documentação principal
├── CONTRIBUTING.md         # Guia de contribuição
└── ARCHITECTURE.md         # Este arquivo
```

## Componentes Principais

### Header
- Exibe o logo/nome da empresa
- Contém a navegação principal
- Sticky no topo da página

### Navbar
- Menu de navegação responsivo
- Links para diferentes seções
- Suporta mobile e desktop

### HeroSection
- Seção principal com chamada à ação
- Botões de WhatsApp para agendamento
- Design atrativo e profissional

### Componentes de Página
- `TerapiaCorporativa.tsx` - Serviço de terapia corporativa
- `ProjetoEscola.tsx` - Projeto escolar
- `TerapiaBaixoCusto.tsx` - Terapia acessível
- `Mentoria.tsx` - Serviço de mentoria
- `MeuAtendimento.tsx` - Informações de atendimento
- `Credenciais.tsx` - Credenciais profissionais
- `Depoimentos.tsx` - Depoimentos de clientes
- `OQueETrg.tsx` - Informações sobre TRG
- `Faq.tsx` - Perguntas frequentes
- `Frases.tsx` - Frases motivacionais
- `Fobias.tsx` - Informações sobre fobias
- `Ebooks.tsx` - E-books disponíveis

### Footer
- Informações de contato
- Links para redes sociais
- Idiomas de atendimento

### Ícones
- Componentes SVG reutilizáveis
- `WhatsappIcon.tsx`
- `InstagramIcon.tsx`
- Outros ícones conforme necessário

## Fluxo de Navegação

A aplicação usa um sistema de roteamento baseado em estado:

```
App.tsx
├── currentPage state
├── renderCurrentPage()
│   ├── 'home' → HeroSection
│   ├── 'terapia-corporativa' → TerapiaCorporativa
│   ├── 'projeto-escola' → ProjetoEscola
│   ├── 'terapia-baixo-custo' → TerapiaBaixoCusto
│   ├── 'mentoria' → Mentoria
│   ├── 'meu-atendimento' → MeuAtendimento
│   ├── 'credenciais' → Credenciais
│   ├── 'depoimentos' → Depoimentos
│   ├── 'o-que-e-trg' → OQueETrg
│   ├── 'faq' → Faq
│   ├── 'frases' → Frases
│   ├── 'fobias' → Fobias
│   └── 'ebooks' → Ebooks
└── setCurrentPage callback
```

## Estilização

### Tailwind CSS
- Utilitários de estilo
- Configuração customizada em `tailwind.config.js`
- Cores principais: teal, slate, stone
- Componentes customizados em `index.css`

### Componentes CSS
Definidos em `index.css` com `@layer components`:
- `.btn-primary` - Botão primário
- `.btn-secondary` - Botão secundário
- `.section-container` - Container de seção
- `.heading-primary` - Título principal
- `.heading-secondary` - Título secundário
- `.text-muted` - Texto atenuado

## Variáveis de Ambiente

```env
GEMINI_API_KEY          # Chave da API Gemini
VITE_MARCELO_WHATSAPP   # WhatsApp do Marcelo
VITE_NADIELMA_WHATSAPP  # WhatsApp da Nadielma
VITE_INSTAGRAM_URL      # URL do Instagram
```

## Ferramentas de Desenvolvimento

### ESLint
- Verificação de código
- Configuração em `eslint.config.js`
- Plugins: React, React Hooks, TypeScript

### Prettier
- Formatação automática de código
- Configuração em `.prettierrc.json`
- Integrado com ESLint

### Vite
- Build tool e dev server
- Hot Module Replacement (HMR)
- Otimização automática para produção

### TypeScript
- Tipagem estática
- Melhor experiência de desenvolvimento
- Detecção de erros em tempo de compilação

## Performance

- **Code Splitting**: Vite automaticamente faz split de código
- **Tree Shaking**: Remove código não utilizado
- **Minificação**: CSS e JS minificados em produção
- **Lazy Loading**: Componentes carregados sob demanda

## Segurança

- Variáveis sensíveis em `.env.local`
- `.env.local` não é versionado (em `.gitignore`)
- Uso de `rel="noopener noreferrer"` em links externos
- Validação de entrada em formulários

## Portal do Usuário e Sistema de Autenticação

### Visão Geral
O portal do usuário é uma área autenticada da aplicação que oferece funcionalidades específicas para dois tipos de usuários: **Pacientes** e **Terapeutas** (A e B). O sistema utiliza autenticação baseada em sessão com suporte a diferentes perfis de acesso.

### Estrutura de Diretórios (Portal)

```
components/
├── auth/
│   ├── Login.tsx              # Página de login
│   ├── Register.tsx           # Página de cadastro
│   ├── ProtectedRoute.tsx     # Componente para rotas protegidas
│   └── AuthContext.tsx        # Context de autenticação
├── dashboard/
│   ├── DashboardLayout.tsx    # Layout base do dashboard
│   ├── Sidebar.tsx            # Menu lateral
│   └── TopBar.tsx             # Barra superior
├── patient/
│   ├── PatientDashboard.tsx   # Dashboard principal do paciente
│   ├── Appointments.tsx       # Seção de agendamentos
│   ├── Messages.tsx           # Sistema de mensagens
│   ├── Reports.tsx            # Meus relatórios
│   ├── TestShop.tsx           # Loja de testes
│   ├── AttendanceHistory.tsx  # Histórico de atendimentos
│   └── Profile.tsx            # Perfil do paciente
├── therapist/
│   ├── TherapistDashboard.tsx # Dashboard do terapeuta
│   ├── Schedule.tsx           # Agenda do terapeuta
│   ├── PatientList.tsx        # Lista de pacientes
│   ├── Messages.tsx           # Caixa de mensagens
│   ├── DocumentGeneration.tsx # Geração de documentos
│   └── Profile.tsx            # Perfil do terapeuta
└── shared/
    ├── MessageThread.tsx      # Componente de chat
    ├── DocumentViewer.tsx     # Visualizador de documentos
    └── ConfirmDialog.tsx      # Diálogo de confirmação
```

### Papéis e Perfis de Usuário (Roles)

#### 1. Paciente (Usuário Padrão)
- **Acesso**: Ferramentas de serviço e agendamento
- **Permissões**: Visualizar próprios agendamentos, enviar mensagens, acessar relatórios
- **Restrições**: Não pode acessar dados de outros pacientes

#### 2. Terapeuta A
- **Acesso**: Dashboard de gerenciamento de clientela e agenda
- **Permissões**: Gerenciar agendamentos, responder mensagens, emitir documentos
- **Dados**: Isolados do Terapeuta B

#### 3. Terapeuta B
- **Acesso**: Dashboard de gerenciamento de clientela e agenda
- **Permissões**: Idênticas ao Terapeuta A (funcionalidades espelhadas)
- **Dados**: Isolados do Terapeuta A

### Sistema de Autenticação

#### Fluxo de Login
```
1. Usuário acessa /login
2. Insere email/CPF e senha
3. Sistema valida credenciais
4. Se válido:
   - Cria sessão
   - Armazena token em sessionStorage
   - Redireciona para dashboard apropriado
5. Se inválido:
   - Exibe mensagem de erro
   - Permite nova tentativa
```

#### Fluxo de Cadastro
```
1. Usuário acessa /register
2. Seleciona tipo de perfil (Paciente ou Terapeuta)
3. Preenche formulário com dados pessoais
4. Se Terapeuta: adiciona credenciais profissionais
5. Sistema valida dados
6. Se válido:
   - Cria conta
   - Envia email de confirmação
   - Redireciona para login
7. Se inválido:
   - Exibe erros de validação
```

#### Armazenamento de Sessão
- **Token**: Armazenado em sessionStorage (não persiste após fechar aba)
- **Dados do Usuário**: ID, nome, email, role, foto de perfil
- **Refresh**: Token renovado a cada 30 minutos de inatividade

### Dashboard do Paciente (Minha Conta)

#### 1. Seção: Agendamentos
**Meus Agendamentos**
- Visualização de sessões futuras em formato de calendário
- Histórico de consultas passadas
- Status de cada agendamento (confirmado, pendente, cancelado)
- Opções: Reagendar, Cancelar, Visualizar detalhes

**Novo Agendamento**
- Seleção do Terapeuta (A ou B)
- Visualização de disponibilidade em tempo real
- Seleção de horário preferido
- Confirmação com resumo
- Notificação de agendamento realizado

#### 2. Seção: Comunicação
**Mensagens Diretas**
- Chat privado e seguro com terapeuta
- Histórico de conversas
- Notificações de novas mensagens
- Anexo de arquivos (imagens, documentos)
- Timestamp de envio/leitura

#### 3. Seção: Relatórios e Testes
**Meus Relatórios**
- Acesso a documentos emitidos pelo terapeuta
- Download de relatórios, diagnósticos, notas de progresso
- Filtro por data e tipo de documento
- Visualização em PDF

**Loja de Testes**
- Catálogo de testes e materiais disponíveis
- Descrição e preço de cada teste
- Carrinho de compras
- Fluxo de checkout simulado
- Histórico de compras

#### 4. Seção: Atendimentos
**Histórico de Atendimentos**
- Resumo de sessões realizadas
- Registro de frequência
- Duração de cada atendimento
- Notas do terapeuta (se autorizado)

#### 5. Seção: Minha Conta
**Perfil**
- Edição de dados pessoais (nome, telefone, endereço)
- Atualização de foto de perfil
- Gerenciamento de contatos de emergência
- Redefinição de senha
- Opção de desativar conta

### Dashboard do Terapeuta

#### 1. Agenda do Terapeuta
- Visualização consolidada de todos os agendamentos
- Filtro por data, paciente ou status
- Confirmação de sessões
- Reagendamento de sessões
- Cancelamento com motivo
- Sincronização com calendário externo (Google Calendar, Outlook)

#### 2. Caixa de Mensagens
- Recebimento de mensagens dos pacientes
- Resposta em tempo real
- Histórico de conversas
- Notificações de novas mensagens
- Busca em conversas anteriores

#### 3. Gerenciamento de Pacientes
- Lista de clientes ativos
- Filtro por nome, CPF ou status
- Acesso rápido ao histórico de agendamentos
- Status do paciente (ativo, inativo, em pausa)
- Notas internas sobre o paciente
- Contato de emergência

#### 4. Emissão de Documentos
- Geração de relatórios de progresso
- Emissão de laudos e diagnósticos
- Templates pré-configurados
- Editor de texto rico
- Assinatura digital
- Envio automático para "Meus Relatórios" do paciente

### Fluxo de Navegação (Portal Autenticado)

```
App.tsx
├── AuthContext (gerencia autenticação)
├── ProtectedRoute (verifica autenticação)
├── /login → Login.tsx
├── /register → Register.tsx
├── /dashboard
│   ├── [Paciente]
│   │   ├── /appointments → Appointments.tsx
│   │   ├── /messages → Messages.tsx
│   │   ├── /reports → Reports.tsx
│   │   ├── /test-shop → TestShop.tsx
│   │   ├── /attendance → AttendanceHistory.tsx
│   │   └── /profile → Profile.tsx
│   └── [Terapeuta A/B]
│       ├── /schedule → Schedule.tsx
│       ├── /patients → PatientList.tsx
│       ├── /messages → Messages.tsx
│       ├── /documents → DocumentGeneration.tsx
│       └── /profile → Profile.tsx
└── /logout → Limpa sessão e redireciona para home
```

### Modelos de Dados

#### Usuário (User)
```typescript
interface User {
  id: string;
  email: string;
  name: string;
  cpf: string;
  phone: string;
  role: 'patient' | 'therapist_a' | 'therapist_b';
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Agendamento (Appointment)
```typescript
interface Appointment {
  id: string;
  patientId: string;
  therapistId: string;
  startTime: Date;
  endTime: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
  notes?: string;
  createdAt: Date;
}
```

#### Mensagem (Message)
```typescript
interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  attachments?: string[];
  timestamp: Date;
  read: boolean;
}
```

#### Documento (Document)
```typescript
interface Document {
  id: string;
  patientId: string;
  therapistId: string;
  type: 'report' | 'diagnosis' | 'progress_note';
  title: string;
  content: string;
  fileUrl: string;
  createdAt: Date;
}
```

### Segurança

#### Autenticação
- Senhas hasheadas com bcrypt
- Tokens JWT com expiração
- Refresh tokens para sessões prolongadas
- HTTPS obrigatório em produção

#### Autorização
- Verificação de role em cada rota protegida
- Isolamento de dados por usuário
- Validação de permissões no backend

#### Proteção de Dados
- Criptografia de mensagens sensíveis
- Backup regular de dados
- LGPD compliance (direito ao esquecimento)

### Próximos Passos para Implementação

1. **Configurar React Router**: Migrar de state-based routing para React Router v6
2. **Implementar Context API**: Criar AuthContext para gerenciar autenticação
3. **Backend API**: Desenvolver endpoints para autenticação e CRUD
4. **Banco de Dados**: Configurar PostgreSQL com Prisma ORM
5. **Validação**: Implementar Zod ou Yup para validação de formulários
6. **Testes**: Adicionar testes para fluxos de autenticação
7. **UI Components**: Criar componentes reutilizáveis para dashboard
8. **Notificações**: Implementar sistema de notificações em tempo real

## Próximos Passos para Melhorias

1. **Roteamento**: Considerar migrar para React Router para melhor escalabilidade
2. **State Management**: Implementar Context API ou Redux se necessário
3. **Testes**: Adicionar testes unitários com Vitest
4. **E2E Testing**: Implementar testes E2E com Playwright
5. **Acessibilidade**: Melhorar ARIA labels e navegação por teclado
6. **SEO**: Implementar meta tags dinâmicas e sitemap
7. **Analytics**: Adicionar rastreamento de eventos
8. **PWA**: Transformar em Progressive Web App

## Contribuindo

Veja [CONTRIBUTING.md](./CONTRIBUTING.md) para instruções detalhadas sobre como contribuir com o projeto.
