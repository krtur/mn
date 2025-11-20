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
