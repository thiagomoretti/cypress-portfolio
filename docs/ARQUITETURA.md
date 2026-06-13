# 🏗️ Arquitetura de Testes Cypress - Clean Test Architecture

## 📋 Estrutura do Projeto

```
cypress-portfolio/
├── cypress/
│   ├── e2e/
│   │   ├── login.cy.js          ← Testes de login
│   │   └── cadastro.cy.js       ← Testes de cadastro
│   ├── fixtures/
│   │   ├── usuario.json         ← Dados de usuário
│   │   └── cadastro.json        ← Dados de cadastro
│   └── support/
│       ├── pages/
│       │   ├── login-page.js    ← Page Object para Login
│       │   └── cadastro-page.js ← Page Object para Cadastro
│       ├── commands.js          ← Comandos customizados
│       └── e2e.js               ← Configurações globais
├── docs/
│   └── ARQUITETURA.md           ← Este arquivo
├── .github/
│   └── skills/                  ← Skills customizadas (futuro)
├── cypress.config.js            ← Configuração do Cypress
├── package.json
└── README.md
```

---

## 🎯 Princípios e Padrões

### 1️⃣ Padrão AAA (Arrange-Act-Assert)

Todos os testes seguem o padrão AAA para máxima clareza:

```javascript
it('✅ Deve fazer login com sucesso', () => {
  // ARRANGE - Preparar dados de teste
  const email = 'admin@biblioteca.com'
  const senha = 'admin123'

  // ACT - Executar a ação
  loginPage.fazerLogin(email, senha)

  // ASSERT - Validar resultado
  loginPage.validarLoginSucesso('admin-dashboard')
})
```

### 2️⃣ Page Object Model (POM)

Cada página tem um Page Object que encapsula:
- **Seletores**: Todos os elementos da página
- **Métodos de ação**: Interações com a página
- **Métodos de validação**: Asserções específicas

**Benefício**: Mudanças na UI afetam apenas o Page Object, não os testes.

```javascript
// Uso no teste
loginPage.fazerLogin(email, senha)
loginPage.validarLoginSucesso('admin-dashboard')

// Implementação no Page Object
fazerLogin(email, senha) {
  this.preencherEmail(email)
  this.preencherSenha(senha)
  this.clicarBotaoLogin()
}
```

### 3️⃣ Fixtures para Dados de Teste

Dados de teste estão separados do código em fixtures JSON:

```json
{
  "email": "usuario@teste.com",
  "senha": "user123"
}
```

**Benefício**: Fácil manutenção de dados, reutilização, sem hardcoding.

### 4️⃣ Comandos Customizados

Comandos reutilizáveis para ações comuns:

```javascript
// Definição em commands.js
Cypress.Commands.add('login', (email, senha) => {
  cy.get('#email').type(email)
  cy.get('#password').type(senha)
  cy.get('#login-btn').click()
})

// Uso nos testes
cy.login('admin@biblioteca.com', 'admin123')
```

### 5️⃣ beforeEach para Setup Consistente

Cada teste começa em um estado limpo:

```javascript
beforeEach(() => {
  cadastroPage.visitarPaginaCadastro()
  cy.limparArmazenamento() // Limpar dados stale
})
```

---

## 📚 Page Objects

### LoginPage (`cypress/support/pages/login-page.js`)

**Métodos principais:**

```javascript
// Navegação
loginPage.visitarPaginaLogin()

// Preenchimento
loginPage.preencherEmail(email)
loginPage.preencherSenha(senha)
loginPage.fazerLogin(email, senha)

// Ações
loginPage.clicarBotaoLogin()
loginPage.clicarBotaoCadastro()

// Validações
loginPage.validarLoginSucesso(urlEsperada)
loginPage.validarMensagemErro(mensagem)
loginPage.validarCamposVazios()
```

### CadastroPage (`cypress/support/pages/cadastro-page.js`)

**Métodos principais:**

```javascript
// Navegação
cadastroPage.visitarPaginaCadastro()

// Preenchimento
cadastroPage.preencherNome(nome)
cadastroPage.preencherEmail(email)
cadastroPage.preencherTelefone(telefone)
cadastroPage.preencherSenha(senha)
cadastroPage.preencherCadastro(nome, email, telefone, senha, confirmaSenha)

// Ações
cadastroPage.fazerCadastro(nome, email, telefone, senha, confirmaSenha)
cadastroPage.clicarBotaoLimpar()

// Validações
cadastroPage.validarCadastroSucesso(nomeEsperado)
cadastroPage.validarErro(campo, mensagem)
cadastroPage.validarFormularioVazio()
```

---

## 🛠️ Comandos Customizados

### Login

```javascript
// Fazer login via UI
cy.login(email, senha)

// Fazer login via API (mais rápido para setup)
cy.loginViaAPI(email, senha)
```

### Cadastro

```javascript
// Preencher formulário
cy.preencherCadastro(nome, email, telefone, senha, confirmaSenha)

// Fazer cadastro completo
cy.fazerCadastro(nome, email, telefone, senha, confirmaSenha)

// Fazer cadastro via API
cy.cadastroViaAPI(nome, email, telefone, senha)
```

### Utilitários

```javascript
// Aguardar e clicar
cy.clicarAposAguardar(seletor, timeout)

// Aguardar e preencher
cy.preencherAposAguardar(seletor, valor, timeout)

// Limpar armazenamento
cy.limparArmazenamento()

// Fazer logout
cy.logout()

// Aguardar API
cy.aguardarAPI(metodo, url, alias)

// Gerar email único
const email = cy.gerarEmailUnico('prefixo')
```

---

## 📊 Fixtures

### `usuario.json`
Dados de usuário para testes de login e consulta.

### `cadastro.json`
Dados de teste para validação de cadastro (nomes válidos, senhas, etc).

**Para adicionar novos dados:**
1. Criar arquivo JSON em `cypress/fixtures/`
2. Importar no teste: `import dados from '../fixtures/dados.json'`
3. Usar nos testes

---

## 🧪 Anatomia de um Teste

```javascript
describe('🔐 Suite de Testes', () => {
  beforeEach(() => {
    // Setup: Navegar, limpar dados, preparar estado
    loginPage.visitarPaginaLogin()
  })

  it('✅ Deve fazer login com sucesso', () => {
    // ARRANGE
    const email = 'admin@biblioteca.com'
    const senha = 'admin123'

    // ACT
    loginPage.fazerLogin(email, senha)

    // ASSERT
    loginPage.validarLoginSucesso('admin-dashboard')
  })

  it('❌ Deve exibir erro com senha incorreta', () => {
    // ARRANGE
    const email = 'admin@biblioteca.com'
    const senhaErrada = 'incorreta'

    // ACT
    loginPage.fazerLogin(email, senhaErrada)

    // ASSERT
    loginPage.validarMensagemErro('Email ou senha inválidos')
    cy.url().should('include', 'login')
  })
})
```

---

## 🚀 Boas Práticas

### ✅ Faça

- ✅ Use Page Objects para encapsular seletores
- ✅ Separe dados em fixtures
- ✅ Crie comandos para ações repetidas
- ✅ Use comentários explicativos em português
- ✅ Siga o padrão AAA
- ✅ Teste um conceito por teste
- ✅ Use `should()` com encadeamento
- ✅ Adicione logs úteis com `cy.log()`
- ✅ Use nomes descritivos em português
- ✅ Intercept APIs para testes determinísticos

### ❌ Não Faça

- ❌ Hardcode valores nos testes
- ❌ Reutilize dados entre testes
- ❌ Deixe testes dependentes um do outro
- ❌ Use sleeps em vez de waits
- ❌ Misture múltiplos conceitos em um teste
- ❌ Ignore erros de validação
- ❌ Use seletores genéricos (evite `nth-child`)
- ❌ Deixe prints de debug no código

---

## 🔧 Configurações (`cypress.config.js`)

```javascript
{
  baseUrl: 'http://localhost:3000',
  viewportWidth: 1280,
  viewportHeight: 720,
  e2e: {
    // Configurações específicas
  }
}
```

---

## 📝 Exemplo Completo de um Novo Teste

### 1. Criar Page Object (`cypress/support/pages/nova-page.js`)

```javascript
class NovaPage {
  seletores = {
    btnAcao: '#btn-acao',
    mensagem: '.mensagem'
  }

  visitarPagina() {
    cy.visit('/nova-pagina.html')
  }

  clicarBotao() {
    cy.get(this.seletores.btnAcao).click()
  }

  validarMensagem(texto) {
    cy.get(this.seletores.mensagem)
      .should('contain', texto)
  }
}

export default new NovaPage()
```

### 2. Criar Fixture (`cypress/fixtures/nova-data.json`)

```json
{
  "valor1": "teste",
  "valor2": 123
}
```

### 3. Criar Teste (`cypress/e2e/nova-feature.cy.js`)

```javascript
import novaPage from '../support/pages/nova-page'
import data from '../fixtures/nova-data.json'

describe('🆕 Nova Funcionalidade', () => {
  beforeEach(() => {
    novaPage.visitarPagina()
  })

  it('✅ Deve funcionar corretamente', () => {
    // ARRANGE
    const valor = data.valor1

    // ACT
    novaPage.clicarBotao()

    // ASSERT
    novaPage.validarMensagem(valor)
  })
})
```

---

## 🎨 Emojis Utilizados

- 🔐 Login/Autenticação
- 📝 Cadastro/Registro
- ✅ Teste positivo
- ❌ Teste negativo
- 🔄 Fluxo/Ciclo
- ⚡ Performance
- ⚠️ Edge cases
- 🆕 Novo

---

## 📖 Recursos Úteis

- [Documentação Cypress](https://docs.cypress.io/)
- [Page Object Model Pattern](https://docs.cypress.io/guides/references/best-practices)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)

---

## 👤 QA Sênior - Recomendações

1. **Reutilização de Código**: Sempre extraia comportamentos comuns para Page Objects e Comandos
2. **Dados de Teste**: Use Fixtures para facilitar manutenção
3. **Interception**: Mock APIs para testes determinísticos
4. **Documentação**: Comente o "por quê", não o "o quê"
5. **Separação de Concerns**: Um teste = um conceito
6. **Performance**: Use login via API em setup quando possível
7. **Debugging**: Utilize `cy.log()` e `cy.pause()` estrategicamente

---

**Última atualização**: Maio 2026
**Versão Cypress**: ^13.0.0
