# M&N Terapeutas

Website profissional para M&N Terapeutas - Expresso Terapêutico

> Caminhando juntos em direção à sua melhor versão

## 🎯 Sobre

M&N Terapeutas oferece serviços de terapia corporativa, mentoria, atendimento especializado e muito mais. Este website apresenta os serviços de forma profissional e permite que clientes agendem sessões de terapia.

## ✨ Funcionalidades

- **Página inicial** com apresentação dos terapeutas
- **Serviços diversos**: Terapia Corporativa, Projeto Escola, Terapia de Baixo Custo, Mentoria
- **Informações profissionais**: Credenciais, FAQ, Depoimentos
- **Conteúdo educativo**: O que é TRG, Fobias, E-books
- **Integração WhatsApp** para agendamento direto
- **Design responsivo** e moderno
- **Suporte multilíngue**: Português, Inglês e Espanhol

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Instalação

1. Clone o repositório:
```bash
git clone <repository-url>
cd m-n-terapeutas
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
```

Edite `.env.local` e adicione:
- `GEMINI_API_KEY`: Sua chave da API Gemini (obtenha em https://aistudio.google.com/app/apikey)
- `VITE_MARCELO_WHATSAPP`: Número do WhatsApp do Marcelo
- `VITE_NADIELMA_WHATSAPP`: Número do WhatsApp da Nadielma
- `VITE_INSTAGRAM_URL`: URL do perfil Instagram

### Desenvolvimento

Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O app estará disponível em `http://localhost:3000`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`

### Preview da Build

```bash
npm run preview
```

## 🛠️ Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build otimizada para produção
- `npm run preview` - Visualiza a build de produção localmente
- `npm run lint` - Verifica o código com ESLint
- `npm run format` - Formata o código com Prettier

## 📁 Estrutura do Projeto

```
m-n-terapeutas/
├── components/          # Componentes React
│   ├── icons/          # Ícones SVG
│   ├── Header.tsx      # Cabeçalho com navegação
│   ├── Footer.tsx      # Rodapé
│   └── ...             # Outros componentes de página
├── App.tsx             # Componente principal
├── index.tsx           # Ponto de entrada
├── index.html          # HTML base
├── index.css           # Estilos globais (Tailwind)
├── vite.config.ts      # Configuração Vite
├── tailwind.config.js  # Configuração Tailwind CSS
├── tsconfig.json       # Configuração TypeScript
├── eslint.config.js    # Configuração ESLint
└── .prettierrc.json    # Configuração Prettier
```

## 🎨 Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Vite** - Build tool e dev server
- **ESLint** - Linting de código
- **Prettier** - Formatação de código

## 📝 Variáveis de Ambiente

Veja `.env.example` para referência completa. As variáveis necessárias são:

```env
GEMINI_API_KEY=sua_chave_aqui
VITE_MARCELO_WHATSAPP=+55...
VITE_NADIELMA_WHATSAPP=+55...
VITE_INSTAGRAM_URL=https://instagram.com/...
```

## 🤝 Contribuindo

Para contribuir com o projeto:

1. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
2. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para a branch (`git push origin feature/AmazingFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para detalhes.

## 📧 Contato

**M&N Terapeutas**
- WhatsApp: Marcelo e Nadielma
- Instagram: [@seu_perfil](https://instagram.com/seu_perfil)

---

Desenvolvido com ❤️ para M&N Terapeutas
