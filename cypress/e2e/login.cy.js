///<reference types="cypress"/>

import loginPage from '../support/pages/login-page'
import usuario from '../fixtures/usuario.json'

/**
 * Suite de Testes: Funcionalidade de Login
 * Testa diferentes cenários de autenticação de usuários
 * 
 * Padrão AAA: Arrange (preparar) → Act (agir) → Assert (validar)
 */
describe('🔐 Funcionalidade: Login', () => {
  // ===== SETUP =====
  
  beforeEach(() => {
    /**
     * ARRANGE: Preparar o ambiente para cada teste
     * Navega até a página de login
     */
    loginPage.visitarPaginaLogin()
  })

  // ===== TESTES POSITIVOS =====

  it('✅ Deve fazer login com sucesso usando admin', () => {
    /**
     * ARRANGE: Dados de teste preparados
     */
    const email = 'admin@biblioteca.com'
    const senha = 'admin123'

    /**
     * ACT: Realizar a ação de login
     */
    loginPage.fazerLogin(email, senha)

    /**
     * ASSERT: Validar que o login foi bem-sucedido
     */
    loginPage.validarLoginSucesso('admin-dashboard')
    loginPage.aguardarCarregamento()
  })

  it('✅ Deve fazer login com sucesso usando comando customizado', () => {
    /**
     * ARRANGE: Dados de teste
     */
    const email = 'admin@biblioteca.com'
    const senha = 'admin123'

    /**
     * ACT: Usar comando customizado para login
     */
    cy.login(email, senha)

    /**
     * ASSERT: Validar sucesso do login
     */
    cy.url().should('include', 'admin-dashboard')
  })

  it('✅ Deve fazer login com sucesso usando credenciais da conta demo exibida', () => {
    loginPage.obterContaDemoPorIndice(1).then(({ email, senha }) => {
      loginPage.fazerLogin(email, senha)
      loginPage.validarLoginSucesso('dashboard')
    })
  })

  it('✅ Deve fazer login com sucesso usando fixture com dados do usuário', () => {
    /**
     * ARRANGE: Dados carregados da fixture
     */
    // usuario.json contém: { "email": "usuario@teste.com", "senha": "user123" }

    /**
     * ACT: Realizar login com dados da fixture
     */
    loginPage.fazerLogin(usuario.email, usuario.senha)

    /**
     * ASSERT: Validar que o login foi bem-sucedido
     */
    loginPage.validarLoginSucesso('dashboard')
  })

  it('✅ Deve fazer login com sucesso - Page Object Pattern', () => {
    /**
     * ARRANGE: Usar Page Object para encapsular ações
     */
    const credenciais = {
      email: 'usuario@teste.com',
      senha: 'user123'
    }

    /**
     * ACT: Usar métodos do Page Object
     */
    loginPage.preencherEmail(credenciais.email)
    loginPage.preencherSenha(credenciais.senha)
    loginPage.clicarBotaoLogin()

    /**
     * ASSERT: Validar navegação e estado da aplicação
     */
    cy.url()
      .should('include', 'dashboard')
      .and('not.include', 'login')
    
    loginPage.aguardarCarregamento()
  })

  // ===== TESTES NEGATIVOS =====

  it('❌ Deve exibir erro ao tentar login com email inválido', () => {
    /**
     * ARRANGE: Dados inválidos preparados
     */
    const emailInvalido = 'email-inexistente@teste.com'
    const senha = 'user123'

    /**
     * ACT: Tentar fazer login com email inválido
     */
    loginPage.fazerLogin(emailInvalido, senha)
    loginPage.aguardarCarregamento()

    /**
     * ASSERT: Validar mensagem de erro
     */
    loginPage.validarMensagemErro('Email ou senha incorretos')
    cy.url().should('include', 'login')
  })

  it('❌ Deve exibir erro ao tentar login com senha incorreta', () => {
    /**
     * ARRANGE: Dados preparados
     */
    const email = 'admin@biblioteca.com'
    const senhaErrada = 'senhaIncorreta123'

    /**
     * ACT: Tentar fazer login com senha errada
     */
    loginPage.fazerLogin(email, senhaErrada)
    loginPage.aguardarCarregamento()

    /**
     * ASSERT: Validar mensagem de erro
     */
    loginPage.validarMensagemErro('Email ou senha incorretos')
    cy.url().should('include', 'login')
  })

  it('❌ Deve exibir erro ao deixar campos em branco', () => {
    /**
     * ARRANGE: Campos vazios (não preenchidos)
     */

    /**
     * ACT: Clicar no botão de login sem preencher
     */
    loginPage.clicarBotaoLogin()

    /**
     * ASSERT: Validar que o botão fica desabilitado ou exibe erro
     */
    cy.url().should('include', 'login')
    loginPage.validarCamposVazios()
  })

  it('❌ Deve exibir erro ao preencher apenas o email', () => {
    /**
     * ARRANGE: Preparar dados parciais
     */
    const email = 'admin@biblioteca.com'

    /**
     * ACT: Preencher apenas email e tentar fazer login
     */
    loginPage.preencherEmail(email)
    loginPage.clicarBotaoLogin()

    /**
     * ASSERT: Validar que a senha é obrigatória
     */
    cy.url().should('include', 'login')
    cy.get(loginPage.seletores.campoSenha).should('have.class', 'is-invalid')
  })

  it('❌ Deve exibir erro ao preencher apenas a senha', () => {
    /**
     * ARRANGE: Preparar dados parciais
     */
    const senha = 'user123'

    /**
     * ACT: Preencher apenas senha e tentar fazer login
     */
    loginPage.preencherSenha(senha)
    loginPage.clicarBotaoLogin()

    /**
     * ASSERT: Validar que o email é obrigatório
     */
    cy.url().should('include', 'login')
    cy.get(loginPage.seletores.campoEmail).should('have.class', 'is-invalid')
  })

  // ===== TESTES DE FLUXO =====

  it('🔄 Deve permitir tentar login novamente após erro', () => {
    /**
     * ARRANGE: Primeira tentativa com dados errados
     */
    const senhaErrada = 'senhaErrada123'
    const senhaCorreta = 'admin123'

    /**
     * ACT - Primeira tentativa (falha esperada)
     */
    loginPage.fazerLogin('admin@biblioteca.com', senhaErrada)
    loginPage.aguardarCarregamento()

    /**
     * ASSERT: Validar erro
     */
    loginPage.validarMensagemErro('Email ou senha incorretos')

    /**
     * ACT - Segunda tentativa (com dados corretos)
     */
    loginPage.preencherEmail('admin@biblioteca.com')
    loginPage.preencherSenha(senhaCorreta)
    loginPage.clicarBotaoLogin()

    /**
     * ASSERT: Validar sucesso na segunda tentativa
     */
    loginPage.validarLoginSucesso('admin-dashboard')
  })

  it('🔄 Deve redirecionar para dashboard após login bem-sucedido', () => {
    /**
     * ARRANGE: Dados válidos
     */
    const email = 'admin@biblioteca.com'
    const senha = 'admin123'

    /**
     * ACT: Fazer login
     */
    loginPage.fazerLogin(email, senha)

    /**
     * ASSERT: Validar redirecionamento completo
     */
    cy.url()
      .should('include', 'admin-dashboard')
      .should('not.include', 'login')
    
    // Validar que elementos da dashboard estão presentes
    cy.get('body').should('not.contain', 'Email')
  })

  // ===== TESTES DE PERFORMANCE E UX =====

  it('⚡ Deve desabilitar botão de login durante a requisição', () => {
    /**
     * ARRANGE: Interceptar a requisição e adicionar delay
     */
    cy.intercept('POST', '**/api/login', {
      statusCode: 200,
      delay: 2000,
      body: {
        token: 'fake-token',
        id: 1,
        name: 'Admin User',
        isAdmin: true
      }
    }).as('delayedLogin')

    /**
     * ACT: Preencher formulário
     */
    loginPage.preencherEmail('admin@biblioteca.com')
    loginPage.preencherSenha('admin123')

    /**
     * ASSERT: Validar que o botão fica desabilitado durante requisição
     */
    cy.get(loginPage.seletores.botaoLogin)
      .should('not.be.disabled')
      .click()
    cy.get(loginPage.seletores.botaoLogin).should('be.disabled')
    cy.wait('@delayedLogin', { timeout: 10000 })
  })

  it('🔐 Deve limpar campos após logout', () => {
    /**
     * ARRANGE: Fazer login com sucesso
     */
    loginPage.fazerLogin('admin@biblioteca.com', 'admin123')
    loginPage.validarLoginSucesso('admin-dashboard')

    /**
     * ACT: Fazer logout
     */
    cy.logout()

    /**
     * ASSERT: Validar que os campos foram limpos
     */
    cy.url().should('include', 'login')
    loginPage.validarCamposVazios()
  })
})
