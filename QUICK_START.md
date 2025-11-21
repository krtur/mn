# Quick Start - Portal do Usuário

## ⚡ Começar em 3 Passos

### 1️⃣ Instalar
```bash
npm install
```

### 2️⃣ Rodar
```bash
npm run dev
```

### 3️⃣ Acessar
```
http://localhost:5173/login
```

---

## 🎯 Rotas Principais

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Home | Público |
| `/login` | Login | Público |
| `/register` | Cadastro | Público |
| `/dashboard` | Dashboard | Autenticado |
| `/dashboard/appointments` | Agendamentos | Paciente |
| `/dashboard/messages` | Mensagens | Ambos |
| `/dashboard/schedule` | Agenda | Terapeuta |
| `/dashboard/patients` | Pacientes | Terapeuta |

---

## 👤 Testar Acesso

### Paciente
1. Ir para `/register`
2. Selecionar "Paciente"
3. Preencher dados
4. Fazer login
5. Acessar `/dashboard`

### Terapeuta
1. Ir para `/register`
2. Selecionar "Terapeuta A" ou "Terapeuta B"
3. Preencher dados
4. Fazer login
5. Acessar `/dashboard`

---

## 📁 Arquivos Criados

```
26 componentes novos
├── 4 componentes de autenticação
├── 3 componentes de dashboard base
├── 7 componentes de paciente
└── 6 componentes de terapeuta

3 documentos de referência
├── ARCHITECTURE.md (Documentação completa)
├── IMPLEMENTATION_SUMMARY.md (Resumo)
└── PORTAL_SETUP.md (Guia de setup)
```

---

## 🔑 Funcionalidades

### ✅ Implementado
- [x] Login e Cadastro
- [x] Autenticação com Context API
- [x] Proteção de rotas
- [x] Dashboard Paciente (7 seções)
- [x] Dashboard Terapeuta (6 seções)
- [x] Sistema de mensagens
- [x] Gerenciamento de agendamentos
- [x] Loja de testes
- [x] Geração de documentos
- [x] Perfil de usuário
- [x] Responsividade
- [x] Design moderno

### 🔄 Próximo (Backend)
- [ ] Integração com API
- [ ] Banco de dados
- [ ] Autenticação real
- [ ] Notificações em tempo real
- [ ] Upload de arquivos

---

## 🎨 Design

**Cores**:
- Primária: Teal (#0d9488)
- Secundária: Slate (cinza)
- Sucesso: Verde
- Aviso: Amarelo
- Erro: Vermelho

**Componentes**:
- Botões com hover
- Cards com shadow
- Formulários validados
- Tabelas responsivas
- Modais funcionais

---

## 📊 Estrutura

```
App.tsx (Router + AuthProvider)
├── Rotas Públicas
│   ├── Home
│   ├── Login
│   └── Register
└── Rotas Protegidas
    └── DashboardLayout
        ├── Sidebar
        ├── TopBar
        └── Outlet (Componentes específicos)
            ├── PatientDashboard
            ├── Appointments
            ├── Messages
            ├── Reports
            ├── TestShop
            ├── AttendanceHistory
            ├── Profile
            ├── TherapistDashboard
            ├── Schedule
            ├── PatientList
            └── DocumentGeneration
```

---

## 🔐 Segurança

- Sessão em `sessionStorage` (não persiste)
- Proteção de rotas com `ProtectedRoute`
- Validação de role em componentes
- Logout limpa sessão
- HTTPS recomendado em produção

---

## 📱 Responsividade

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)
- ✅ Sidebar colapsável
- ✅ Menu adaptativo

---

## 🚀 Deploy

### Netlify
```bash
npm run build
# Conectar repositório GitHub
# Build: npm run build
# Publish: dist
```

### Vercel
```bash
npm run build
# Conectar repositório GitHub
# Framework: Vite
# Build: npm run build
# Output: dist
```

---

## 🐛 Debug

### Console
```javascript
// Ver usuário autenticado
console.log(JSON.parse(sessionStorage.getItem('user')))

// Ver token
console.log(sessionStorage.getItem('token'))
```

### DevTools
- F12 para abrir
- Aba "Application" para ver sessionStorage
- Aba "Network" para ver requisições

---

## 📚 Documentação

| Arquivo | Conteúdo |
|---------|----------|
| `ARCHITECTURE.md` | Arquitetura completa |
| `IMPLEMENTATION_SUMMARY.md` | Resumo da implementação |
| `PORTAL_SETUP.md` | Guia de configuração |
| `API_INTEGRATION.md` | Integração com API |
| `QUICK_START.md` | Este arquivo |

---

## 💡 Dicas

1. **Testar Responsividade**: F12 → Toggle device toolbar
2. **Inspecionar Componentes**: React DevTools
3. **Ver Logs**: F12 → Console
4. **Limpar Cache**: Ctrl+Shift+Delete
5. **Hot Reload**: Salvar arquivo = reload automático

---

## ❓ FAQ

**P: Como fazer login?**
R: Use qualquer email/senha no formulário de login. O sistema é simulado.

**P: Como mudar de paciente para terapeuta?**
R: Faça logout e cadastre-se novamente com outro perfil.

**P: Onde estão os dados salvos?**
R: Em `sessionStorage`. Perdidos ao fechar a aba.

**P: Como integrar com API?**
R: Veja `API_INTEGRATION.md` para instruções.

**P: Posso usar em produção?**
R: Não, precisa de backend e banco de dados primeiro.

---

## 🎓 Aprender Mais

- [React Router](https://reactrouter.com/)
- [Context API](https://react.dev/reference/react/useContext)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)

---

## ✨ Próximas Features

- [ ] Notificações em tempo real
- [ ] Upload de arquivos
- [ ] Integração de pagamento
- [ ] Relatórios avançados
- [ ] Agendamento automático
- [ ] Integração com calendário
- [ ] Videoconferência
- [ ] Análise de dados

---

## 📞 Suporte

Dúvidas? Consulte:
1. `ARCHITECTURE.md` - Documentação técnica
2. `PORTAL_SETUP.md` - Problemas de setup
3. `API_INTEGRATION.md` - Integração com backend
4. Código comentado nos componentes

---

## ✅ Checklist Rápido

- [ ] `npm install` executado
- [ ] `npm run dev` rodando
- [ ] Acessar `http://localhost:5173`
- [ ] Fazer cadastro
- [ ] Fazer login
- [ ] Explorar dashboard
- [ ] Testar funcionalidades
- [ ] Ler documentação

---

**Pronto para começar? Execute `npm install && npm run dev`** 🚀

---

**Última atualização**: 20 de Novembro de 2024
