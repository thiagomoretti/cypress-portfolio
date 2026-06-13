# 📋 Instruções do Projeto Cypress Portfolio

[![Cypress](https://img.shields.io/badge/Cypress-13.0.0-green?logo=cypress)](https://cypress.io)
[![Node.js](https://img.shields.io/badge/Node.js-16%2B-blue?logo=node.js)](https://nodejs.org)
[![Tests](https://img.shields.io/badge/Tests-38%20Professional-success)]()  
[![License](https://img.shields.io/badge/License-MIT-blue)](#-licença)

## 🎯 Descrição

Este é um projeto de portfólio profissional de automação de testes com **Cypress** seguindo **Clean Test Architecture** com mais de 8 anos de experiência em QA.

**O que você vai encontrar:**
- ✅ 38 testes profissionais (login + cadastro + carrinho)
- ✅ Page Object Model Pattern
- ✅ Fixtures para separação de dados
- ✅ 10 comandos customizados reutilizáveis
- ✅ Padrão AAA (Arrange-Act-Assert)
- ✅ Documentação completa em português

---

## � Pré-requisitos

- **Node.js**: 16.x ou superior
- **npm**: 8.x ou superior  
- **Cypress**: 13.0.0+
- **Navegadores testados**: Chrome, Firefox, Edge
- **Porta disponível**: 3000 (para servidor Hub de Leitura)

> **Windows**: Se usar WSL, certifique-se de que o Docker Desktop ou outro virtualizador está ativo.

---

## �🚀 Quick Start

### 1. Instalar dependências do projeto
```bash
npm install
```

### 2. Instalar dependências do servidor de apoio
```bash
cd hub-de-leitura
npm install
```

### 3. Iniciar o servidor do Hub de Leitura
```bash
npm start
```

> O backend deve estar ativo em `http://localhost:3000` antes de iniciar o Cypress.

### 4. Abrir Cypress (Interface Gráfica)
```bash
cd ..
npm run cypress:open
```

### 5. Executar testes em modo headless
```bash
npm run cypress:run
```

> **Relatórios**: Screenshots e vídeos são salvos em `cypress/screenshots/` e `cypress/videos/`

---

## 📁 Estrutura Explicada

```
cypress/
├── e2e/
│   ├── login.cy.js            ← Testes de autenticação
│   ├── cadastro.cy.js         ← Testes de cadastro
│   └── carrinho-livros.cy.js  ← Testes de carrinho de compras
├── fixtures/
│   ├── usuario.json           ← Dados de usuário
│   └── cadastro.json          ← Dados de cadastro
└── support/
    ├── pages/
    │   ├── login-page.js      ← Encapsula UI de login
    │   ├── cadastro-page.js   ← Encapsula UI de cadastro
    │   └── carrinho-page.js   ← Encapsula UI do carrinho
    ├── commands.js            ← Comandos reutilizáveis
    └── e2e.js                 ← Setup global
```

---

## 🎨 Padrões Utilizados

### 1. AAA (Arrange-Act-Assert)
```javascript
it('✅ Deve fazer login com sucesso', () => {
  // ARRANGE
  const email = 'admin@biblioteca.com'
  
  // ACT
  loginPage.fazerLogin(email, 'admin123')
  
  // ASSERT
  loginPage.validarLoginSucesso('admin-dashboard')
})
```

### 2. Page Object Model
```javascript
// Uso
loginPage.fazerLogin(email, senha)

// Implementação no POM
fazerLogin(email, senha) {
  this.preencherEmail(email)
  this.preencherSenha(senha)
  this.clicarBotaoLogin()
}
```

### 3. Fixtures para Dados
```json
// usuario.json
{
  "email": "usuario@teste.com",
  "senha": "user123"
}
```

```javascript
// Uso no teste
import usuario from '../fixtures/usuario.json'
cy.login(usuario.email, usuario.senha)
```

### 4. Comandos Customizados
```javascript
// Definição
Cypress.Commands.add('login', (email, senha) => {
  cy.get('#email').type(email)
  cy.get('#password').type(senha)
  cy.get('#login-btn').click()
})

// Uso
cy.login('admin@biblioteca.com', 'admin123')
```

---

## 📚 Documentação

### Documentos Disponíveis

1. 📖 [ARQUITETURA.md](./ARQUITETURA.md) - Guia completo de arquitetura
   - Padrões implementados
   - Documentação de Page Objects
   - Recomendações de QA Sênior

2. 🚀 [INICIO_RAPIDO.md](./INICIO_RAPIDO.md) - Quick start guide
   - Instruções de instalação
   - Exemplos de uso
   - Troubleshooting

3. 📋 [MELHORIAS_IMPLEMENTADAS.md](./MELHORIAS_IMPLEMENTADAS.md) - Resumo de tudo
   - O que foi criado
   - Cobertura de testes
   - Checklist de qualidade

---

## 🧪 Cobertura de Testes

O projeto cobre os principais fluxos do Hub de Leitura com os seguintes suites:

### Login (14 testes)
- ✅ 5 testes positivos
- ❌ 5 testes negativos
- 🔄 3 testes de fluxo
- ⚡ 2 testes de validação de UX

### Cadastro (19 testes)
- ✅ 5 testes positivos
- ❌ 7 testes negativos
- 🔄 2 testes de fluxo
- ⚡ 1 teste de performance
- ⚠️ 4 edge cases

### Carrinho de Livros (5 testes)
- ✅ 3 testes de fluxo de carrinho
- ❌ 1 teste de validação de estado
- 🔄 1 teste de navegação

---

## 🛠️ Como Usar

### Executar Todos os Testes
```bash
npm run cypress:run
```

### Executar Suite Específica
```bash
# Apenas testes de login
npm run test:login

# Apenas testes de cadastro
npm run test:cadastro

# Arquivo específico
npm run cypress:run -- --spec "cypress/e2e/login.cy.js"
```

### Executar com Navegador Específico
```bash
# Chrome
npm run cypress:run -- --browser chrome

# Firefox
npm run cypress:run -- --browser firefox

# Edge
npm run cypress:run -- --browser edge
```

---

## 📝 Adicionar Novo Teste

### 1. Criar Page Object (se novo)
```javascript
// cypress/support/pages/nova-page.js
class NovaPage {
  seletores = {
    botao: '#btn-novo'
  }

  clicarBotao() {
    cy.get(this.seletores.botao).click()
  }
}

export default new NovaPage()
```

### 2. Criar Fixture (se necessário)
```json
// cypress/fixtures/nova-data.json
{
  "valor": "teste"
}
```

### 3. Criar Teste
```javascript
// cypress/e2e/nova-feature.cy.js
import novaPage from '../support/pages/nova-page'

describe('🆕 Nova Feature', () => {
  beforeEach(() => {
    novaPage.visitarPagina()
  })

  it('✅ Deve fazer algo', () => {
    // ARRANGE, ACT, ASSERT
  })
})
```

---

## ✅ Boas Práticas

### Faça ✓
- ✓ Use Page Objects
- ✓ Separe dados em fixtures
- ✓ Crie comandos reutilizáveis
- ✓ Comente em português
- ✓ Use padrão AAA
- ✓ Um conceito por teste
- ✓ beforeEach para setup
- ✓ Nomes descritivos

### Evite ✗
- ✗ Hardcode de dados
- ✗ Testes dependentes
- ✗ Múltiplos conceitos por teste
- ✗ Sleep em vez de wait
- ✗ Seletores genéricos (nth-child)
- ✗ Testes sem comentários
- ✗ Ignorar erros

---

## 🔍 Troubleshooting

### Problema: Elemento não encontrado
**Solução**: Verifique seletor em `seletores` do Page Object

### Problema: Timeout
**Solução**: Aumente timeout ou use esperas explícitas

### Problema: Email duplicado
**Solução**: Use `Date.now()` ou Faker para emails únicos

### Problema: Teste lento
**Solução**: Use login via API em setup, apenas UI em testes específicos

---

## 🎓 Recursos de Aprendizado

- [Cypress Documentação](https://docs.cypress.io/)
- [Page Object Pattern](https://docs.cypress.io/guides/references/best-practices)
- [Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [ARQUITETURA.md](./docs/ARQUITETURA.md) - Deste projeto

---

## 📊 Checklist de Qualidade

- ✅ Padrão AAA em todos os testes
- ✅ Page Objects para todas as páginas
- ✅ Fixtures para separação de dados
- ✅ Comandos customizados reutilizáveis
- ✅ beforeEach para setup
- ✅ Comentários em português
- ✅ Nomes descritivos
- ✅ Asserções encadeadas
- ✅ Sem hardcoding
- ✅ Documentação completa

---

## � Versionamento

- **v1.0** - Inicialização com login + cadastro
- Data: Junho 2024
- Cypress: ^13.0.0
- Node: 16+

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja o arquivo `LICENSE` para detalhes.

---

## 🚀 Roadmap

### 🔴 Alta Prioridade
- [ ] **Adicionar testes de API** - Integração com endpoints do backend
- [ ] **Configurar CI/CD** - GitHub Actions com relatórios automáticos
- [ ] **Integrar com Allure Reporter** - Relatórios visuais profissionais

### 🟡 Média Prioridade
- [ ] **Implementar testes de performance** - Verificar tempos de resposta
- [ ] **Adicionar testes de acessibilidade** - WCAG compliance
- [ ] **Relatórios customizados** - Dashboard com métricas

### 🟢 Baixa Prioridade
- [ ] **Mobile testing setup** - Responsiveness testing
- [ ] **Docker setup** - Facilitar ambiente local
- [ ] **E-mail testing** - Validação de notificações

---

## 📞 Contato

Dúvidas sobre este projeto?

Consulte:
1. 📖 [ARQUITETURA.md](./docs/ARQUITETURA.md)
2. 🚀 [INICIO_RAPIDO.md](./docs/INICIO_RAPIDO.md)
3. 📋 [MELHORIAS_IMPLEMENTADAS.md](./docs/MELHORIAS_IMPLEMENTADAS.md)
4. 💻 Código dos testes (bem comentado)

---

**Obrigado por usar este projeto! 🎉**
