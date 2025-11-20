# Guia de Contribuição

Obrigado por considerar contribuir para M&N Terapeutas! Este documento fornece diretrizes e instruções para contribuir com o projeto.

## Como Contribuir

### Reportando Bugs

Antes de criar um relatório de bug, verifique a lista de issues, pois você pode descobrir que o bug já foi reportado. Quando você está criando um relatório de bug, inclua o máximo de detalhes possível:

- **Use um título descritivo**
- **Descreva os passos exatos** que reproduzem o problema
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento observado** e aponte qual é o problema
- **Explique qual comportamento você esperava** ver em vez disso

### Sugestões de Melhorias

Sugestões de melhorias são sempre bem-vindas! Ao criar uma sugestão de melhoria, inclua:

- **Use um título descritivo**
- **Forneça uma descrição detalhada** da melhoria sugerida
- **Forneça exemplos específicos** para demonstrar os passos
- **Descreva o comportamento atual** e o comportamento esperado

### Pull Requests

- Preencha o template fornecido
- Siga os guias de estilo do projeto
- Inclua screenshots e GIFs animados quando possível
- Termine todos os arquivos com uma nova linha

## Guia de Estilo

### Git Commit Messages

- Use o tempo presente ("Add feature" não "Added feature")
- Use o modo imperativo ("Move cursor to..." não "Moves cursor to...")
- Limite a primeira linha a 72 caracteres ou menos
- Referencie issues e pull requests liberalmente após a primeira linha

### TypeScript/React

- Use `const` por padrão, `let` quando necessário
- Sempre use tipos TypeScript explícitos
- Use nomes descritivos para variáveis e funções
- Adicione comentários para lógica complexa

### CSS/Tailwind

- Use classes Tailwind em vez de CSS customizado quando possível
- Mantenha a consistência com o design system existente
- Use variáveis de cor definidas no `tailwind.config.js`

## Processo de Desenvolvimento

1. Fork o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Configuração do Ambiente

```bash
# Clone o repositório
git clone <repository-url>
cd m-n-terapeutas

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

## Scripts Úteis

```bash
# Verificar código com ESLint
npm run lint

# Formatar código com Prettier
npm run format

# Build para produção
npm run build

# Preview da build
npm run preview
```

## Licença

Ao contribuir para este projeto, você concorda que suas contribuições serão licenciadas sob a Licença MIT.
