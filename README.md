# 📚 Cypress Portfolio - Hub de Leitura

![Cypress](https://img.shields.io/badge/Cypress-15.15.0-04AAFF?logo=cypress)&nbsp;![JavaScript](https://img.shields.io/badge/JavaScript-%3E%3D12-F7DF1E?logo=javascript)&nbsp;![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-339933?logo=node.js)&nbsp;![License](https://img.shields.io/badge/license-ISC-blue)

## Descrição do projeto

Este repositório é um portfólio profissional de QA com automação de testes E2E usando Cypress para o Hub de Leitura. O objetivo é demonstrar uma arquitetura de testes robusta com Page Objects, fixtures, comandos customizados e fluxo de validação completo para as principais funcionalidades do sistema.

## Tecnologias utilizadas

- **Cypress** (teste E2E)
- **JavaScript**
- **Node.js**
- **@faker-js/faker**
- **Cypress Spec Reporter**
- **Arquitetura de Page Objects**
- **Fixtures** para massas de dados
- **Custom commands** em `cypress/support/commands.js`

> Observação: o projeto está pronto para suportar relatórios avançados como Mochawesome, caso seja integrado em etapas futuras.

## Pré-requisitos

Antes de executar o projeto, verifique se você possui instalado:

- Node.js 18+ 
- npm 9+ 
- Navegador Chrome ou Firefox para execução local

## Como instalar e rodar o projeto

1. Clone o repositório:

```bash
git clone https://github.com/thiagomoretti/cypress-portfolio.git
cd cypress-portfolio
```

2. Instale as dependências:

```bash
npm install
```

3. Inicie o servidor do Hub de Leitura em outro terminal:

```bash
cd hub-de-leitura
npm install
npm start
```

4. Depois que o servidor estiver ativo em `http://localhost:3000`, execute o Cypress em modo interativo:

```bash
cd ..
npm run cypress:open
```

5. Execute os testes em modo headless:

```bash
npm run cypress:run
```

## Estrutura de pastas do projeto

```text
cypress-portfolio/
├── cypress/
│   ├── e2e/
│   │   ├── cadastro.cy.js
│   │   ├── carrinho-livros.cy.js
│   │   └── login.cy.js
│   ├── fixtures/
│   │   ├── cadastro.json
│   │   ├── livros.json
│   │   └── usuario.json
│   └── support/
│       ├── commands.js
│       ├── e2e.js
│       └── pages/
│           ├── cadastro-page.js
│           ├── carrinho-page.js
│           └── login-page.js
├── .github/
│   └── skills/
│       ├── fixture-massa-dados.md
│       └── seletores.md
├── cypress.config.js
├── package.json
└── README.md
```

## Funcionalidades testadas

O portfólio cobre os principais fluxos do Hub de Leitura:

- **Login**
- **Cadastro de usuário**
- **Adicionar livro à cesta**

## Skills criadas (.github/skills/)

O repositório contém documentação de QA para reforçar boas práticas e padrões de automação:

- `/.github/skills/fixture-massa-dados.md` - Guia de organização e uso de fixtures
- `/.github/skills/seletores.md` - Guia de seleção de elementos e estratégia de locators

## Como executar os testes

### Abrir o Cypress UI

```bash
npm run cypress:open
```

### Executar todos os testes em modo headless

```bash
npm run cypress:run
```

### Comandos de teste rápidos

| Comando | Descrição |
|---|---|
| `npm test` | Executa todos os testes via Cypress headless |
| `npm run test:login` | Executa apenas o teste de login |
| `npm run test:cadastro` | Executa apenas o teste de cadastro |
| `npm run test:headed` | Executa testes em modo headed |
| `npm run test:ci` | Executa testes com gravação e paralelização (Cypress Cloud) |

## Relatórios gerados

- O Cypress gera relatórios padrão de execução no terminal.
- Resultados podem ser salvos em `cypress/results` via configuração de reporter.
- A arquitetura suporta exportação para relatorios mais avançados (Mochawesome / Allure) quando configurada.

## Próximos passos / Melhorias futuras

- Integrar **Mochawesome** para relatórios HTML mais ricos
- Adicionar **Allure Reporter** para evidências de teste
- Incluir **mock de API** via `cy.intercept()` para testes de contrato
- Criar **cenários adicionais** de regressão e borda
- Adicionar **pipeline CI/CD** com GitHub Actions
- Ampliar cobertura com **testes de acessibilidade**

## Contato / Mentor

- **Mentor:** Thiago Moretti
- **Repositório:** https://github.com/thiagomoretti/cypress-portfolio
- **Suporte:** abra uma issue no repositório para dúvidas e melhorias

