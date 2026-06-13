/**
 * Page Object - Página de Login
 * Encapsula todos os elementos e ações da página de login
 */

class LoginPage {
  // ===== SELETORES =====
  seletores = {
    formLogin: '#login-form',
    campoEmail: '#email',
    campoSenha: '#password',
    botaoLogin: '#login-btn',
    botaoCadastro: 'a[href="/register.html"]',
    alertContainer: '#alert-container',
    demoConta: '.demo-account',
    carregando: '#login-btn .fa-spinner',
  };

  // ===== MÉTODOS DE NAVEGAÇÃO =====
  
  /**
   * Visita a página de login
   */
  visitarPaginaLogin() {
    cy.visit('/login.html');
    cy.get(this.seletores.formLogin, { timeout: 10000 }).should('be.visible');
    cy.contains('Entre com sua conta', { timeout: 10000 }).should('be.visible');
  }

  // ===== MÉTODOS DE PREENCHIMENTO =====

  /**
   * Preenche o campo de email
   * @param {string} email - Email do usuário
   */
  preencherEmail(email) {
    cy.get(this.seletores.campoEmail)
      .should('be.visible')
      .clear()
      .type(email, { delay: 50 });
  }

  /**
   * Preenche o campo de senha
   * @param {string} senha - Senha do usuário
   */
  preencherSenha(senha) {
    cy.get(this.seletores.campoSenha)
      .should('be.visible')
      .clear()
      .type(senha, { delay: 50 });
  }

  /**
   * Realiza login completo com email e senha
   * @param {string} email - Email do usuário
   * @param {string} senha - Senha do usuário
   */
  fazerLogin(email, senha) {
    this.preencherEmail(email);
    this.preencherSenha(senha);
    this.clicarBotaoLogin();
  }

  // ===== MÉTODOS DE AÇÃO =====

  /**
   * Clica no botão de login
   */
  clicarBotaoLogin() {
    cy.get(this.seletores.botaoLogin)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  /**
   * Clica no botão de cadastro
   */
  clicarBotaoCadastro() {
    cy.get(this.seletores.botaoCadastro)
      .should('be.visible')
      .click();
  }

  /**
   * Clica no link "Esqueceu a senha?"
   */
  clicarEsqueceuSenha() {
    cy.get(this.seletores.botaoEsqueceuSenha)
      .should('be.visible')
      .click();
  }

  // ===== MÉTODOS DE VALIDAÇÃO =====

  /**
   * Valida que o login foi realizado com sucesso
   * @param {string} urlEsperada - URL esperada após login (ex: 'admin-dashboard')
   */
  validarLoginSucesso(urlEsperada = 'admin-dashboard') {
    cy.url()
      .should('include', urlEsperada);
    cy.get(this.seletores.alertContainer).should('not.have.class', 'alert-danger');
  }

  /**
   * Valida mensagem de erro no login
   * @param {string} mensagem - Mensagem de erro esperada
   */
  validarMensagemErro(mensagem) {
    cy.get(this.seletores.alertContainer)
      .should('be.visible')
      .should('have.class', 'alert-danger')
      .should('contain', mensagem);
  }

  /**
   * Valida que os campos de entrada estão vazios ou inválidos
   */
  validarCamposVazios() {
    cy.get(this.seletores.campoEmail).should('have.value', '');
    cy.get(this.seletores.campoSenha).should('have.value', '');
  }

  /**
   * Valida que o botão de login está desabilitado
   */
  validarBotaoDesabilitado() {
    cy.get(this.seletores.botaoLogin)
      .should('be.disabled');
  }

  /**
   * Obtém as credenciais de uma conta demo exibida na página
   * @param {number} index - Índice do bloco demo-account
   */
  obterContaDemoPorIndice(index = 0) {
    return cy.get(this.seletores.demoConta)
      .eq(index)
      .then(($account) => {
        const email = $account.find('strong').text().trim();
        const senhaText = $account.find('small.text-muted').text().trim();
        const senha = senhaText.replace(/^Senha:\s*/i, '');
        return { email, senha };
      });
  }

  /**
   * Aguarda o botão de login não estar em loading
   */
  aguardarCarregamento() {
    cy.get('body', { timeout: 10000 }).then(($body) => {
      if ($body.find(this.seletores.botaoLogin).length) {
        cy.get(this.seletores.botaoLogin, { timeout: 10000 })
          .should('not.be.disabled');
      }
    });
  }
}

export default new LoginPage();
