# 🎓 Guia de Início Rápido - Cypress Portfolio

Bem-vindo ao projeto de portfólio de testes Cypress com **Clean Test Architecture**!

## 🚀 Início Rápido

### 1. Instalação das dependências

```bash
npm install
```

### 2. Instalar o Faker (para dados aleatórios)

```bash
npm install @faker-js/faker --save-dev
```

### 3. Abrir o Cypress Test Runner

```bash
npx cypress open
```

### 4. Rodando testes em headless mode

```bash
npx cypress run
```

---

## 📂 Estrutura de Pastas

| Pasta | Descrição |
|-------|-----------|
| `cypress/e2e/` | Testes end-to-end (`.cy.js`) |
| `cypress/fixtures/` | Dados de teste em JSON |
| `cypress/support/pages/` | Page Objects (encapsulação de UI) |
| `cypress/support/commands.js` | Comandos customizados reutilizáveis |
| `docs/` | Documentação do projeto |
| `.github/skills/` | Skills customizadas (futuro) |

---

## 🧪 Estrutura de um Teste

Todos os testes seguem o padrão **AAA** (Arrange-Act-Assert):

```javascript
it('✅ Deve fazer login com sucesso', () => {
  // ARRANGE - Preparar dados
  const email = 'admin@biblioteca.com'
  const senha = 'admin123'

  // ACT - Executar ação
  loginPage.fazerLogin(email, senha)

  // ASSERT - Validar resultado
  loginPage.validarLoginSucesso('admin-dashboard')
})
```

---

## 📁 Arquivos Principais

### Page Objects
- [`login-page.js`](../cypress/support/pages/login-page.js) - Encapsula elementos e ações de login
- [`cadastro-page.js`](../cypress/support/pages/cadastro-page.js) - Encapsula elementos e ações de cadastro

### Testes
- [`login.cy.js`](../cypress/e2e/login.cy.js) - Testes de autenticação (12 casos)
- [`cadastro.cy.js`](../cypress/e2e/cadastro.cy.js) - Testes de registro (15 casos)

### Dados de Teste
- [`usuario.json`](../cypress/fixtures/usuario.json) - Dados de usuário
- [`cadastro.json`](../cypress/fixtures/cadastro.json) - Dados de cadastro

### Comandos
- [`commands.js`](../cypress/support/commands.js) - 10+ comandos customizados

---

## 🎯 Casos de Teste Inclusos

### Login (12 testes)
✅ Login com sucesso  
✅ Login com comando customizado  
✅ Login com fixture  
✅ Login com Page Object  
❌ Email inválido  
❌ Senha incorreta  
❌ Campos vazios  
🔄 Tentativa após erro  
⚡ Performance do botão  
🔐 Logout e limpeza

### Cadastro (15 testes)
✅ Cadastro com sucesso  
✅ Cadastro com Faker  
✅ Cadastro com comando customizado  
✅ Cadastro com Page Object  
✅ Cadastro com fixture  
❌ Nome vazio  
❌ Nome muito curto  
❌ Email inválido  
❌ Senha fraca  
❌ Senhas não conferem  
❌ Termos não aceitos  
🔄 Limpar formulário  
⚡ Performance do botão  
⚠️ Caracteres especiais  
⚠️ Email duplicado

---

## 🛠️ Comandos Disponíveis

### Login
```javascript
cy.login(email, senha)
cy.loginViaAPI(email, senha)
```

### Cadastro
```javascript
cy.preencherCadastro(nome, email, telefone, senha, confirmaSenha)
cy.fazerCadastro(nome, email, telefone, senha, confirmaSenha)
cy.cadastroViaAPI(nome, email, telefone, senha)
```

### Utilitários
```javascript
cy.clicarAposAguardar(seletor, timeout)
cy.preencherAposAguardar(seletor, valor, timeout)
cy.limparArmazenamento()
cy.logout()
cy.aguardarAPI(metodo, url, alias)
cy.gerarEmailUnico(prefixo)
```

---

## 📊 Exemplo de Page Object

```javascript
class LoginPage {
  seletores = {
    campoEmail: '#email',
    campoSenha: '#password',
    botaoLogin: '#login-btn'
  }

  fazerLogin(email, senha) {
    this.preencherEmail(email)
    this.preencherSenha(senha)
    this.clicarBotaoLogin()
  }

  validarLoginSucesso(urlEsperada) {
    cy.url().should('include', urlEsperada)
  }
}
```

---

## 📝 Como Adicionar um Novo Teste

### 1. Criar o Page Object
```javascript
// cypress/support/pages/nova-page.js
class NovaPage {
  // seletores, métodos...
}
export default new NovaPage()
```

### 2. Criar Fixture (se necessário)
```json
// cypress/fixtures/nova-data.json
{ "dado": "valor" }
```

### 3. Criar o Teste
```javascript
// cypress/e2e/nova-feature.cy.js
import novaPage from '../support/pages/nova-page'

describe('🆕 Minha Feature', () => {
  it('✅ Deve fazer algo', () => {
    // ARRANGE, ACT, ASSERT
  })
})
```

---

## 🎨 Emojis para Testes

| Emoji | Significado |
|-------|------------|
| ✅ | Teste positivo |
| ❌ | Teste negativo |
| 🔄 | Teste de fluxo |
| ⚡ | Performance |
| ⚠️ | Edge case |
| 🔐 | Segurança |
| 📝 | Cadastro |
| 🔐 | Login/Auth |

---

## 🔍 Boas Práticas

1. **AAA Pattern** - Sempre use Arrange, Act, Assert
2. **Page Objects** - Encapsule seletores e ações
3. **Fixtures** - Separe dados de teste
4. **Comandos** - Reutilize ações comuns
5. **Nomes Descritivos** - Testes devem ser claros
6. **beforeEach** - Setup consistente
7. **Comentários em Português** - Documentação clara
8. **Sem Hardcoding** - Use fixtures e variáveis

---

## 🚨 Troubleshooting

**Problema**: Teste falha com "elemento não encontrado"  
**Solução**: Verifique o seletor e use `cy.wait()` se necessário

**Problema**: Email duplicado no cadastro  
**Solução**: Use `Date.now()` ou Faker para gerar emails únicos

**Problema**: Teste lento  
**Solução**: Use API para login em setup, apenas UI em testes específicos

---

## 📚 Documentação Completa

Veja [ARQUITETURA.md](./ARQUITETURA.md) para documentação detalhada sobre:
- Padrões de arquitetura
- Componentes principais
- Exemplos de uso
- Recomendações de QA Sênior

---

## ✨ Próximos Passos

1. Configure a URL base em `cypress.config.js`
2. Adapte os seletores aos seus elementos
3. Crie novos Page Objects conforme necessário
4. Expanda os testes com mais cenários
5. Configure CI/CD (GitHub Actions, etc)

---

**Criado com ❤️ por um QA Sênior**  
*Última atualização: Maio 2026*
