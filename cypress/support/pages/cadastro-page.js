/**
 * Page Object - Página de Cadastro
 * Encapsula todos os elementos e ações da página de cadastro
 */

class CadastroPage {
  // ===== SELETORES =====
  seletores = {
    campNome: '#name',
    campoEmail: '#email',
    campoTelefone: '#phone',
    campoSenha: '#password',
    campoConfirmaSenha: '#confirm-password',
    checkboxTermos: '#terms-agreement',
    botaoCadastro: '#register-btn',
    botaoLimpar: null,
    botaoVoltar: 'a.btn.btn-outline-primary[href="/login.html"]',
    validacaoNome: '#name',
    validacaoEmail: '#email',
    validacaoTelefone: '#phone',
    validacaoSenha: '#password',
    validacaoConfirmaSenha: '#confirm-password',
    validacaoTermos: '#terms-agreement',
    mensagemSucesso: '.alert-success',
    mensagemErro: '.alert-danger',
    carregando: '.spinner',
    nomeUsuario: '#user-name',
  };

  // ===== MÉTODOS DE NAVEGAÇÃO =====

  /**
   * Visita a página de cadastro
   */
  visitarPaginaCadastro() {
    cy.visit('/register.html');
    cy.contains('Cadastre-se no Hub de Leitura', { timeout: 5000 }).should('be.visible');
  }

  // ===== MÉTODOS DE PREENCHIMENTO =====

  /**
   * Preenche o campo de nome
   * @param {string} nome - Nome do usuário
   */
  preencherNome(nome) {
    cy.get(this.seletores.campNome)
      .should('be.visible')
      .clear()
      .type(nome, { delay: 50 });
  }

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
   * Preenche o campo de telefone
   * @param {string} telefone - Telefone do usuário
   */
  preencherTelefone(telefone) {
    cy.get(this.seletores.campoTelefone)
      .should('be.visible')
      .clear()
      .type(telefone, { delay: 50 });
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
   * Preenche o campo de confirmação de senha
   * @param {string} senha - Confirmação de senha
   */
  preencherConfirmaSenha(senha) {
    cy.get(this.seletores.campoConfirmaSenha)
      .should('be.visible')
      .clear()
      .type(senha, { delay: 50 });
  }

  /**
   * Marca o checkbox de termos e condições
   */
  marcarCheckboxTermos() {
    cy.get(this.seletores.checkboxTermos)
      .should('be.visible')
      .check({ force: true });
  }

  /**
   * Desmarcar o checkbox de termos e condições
   */
  desmarcarCheckboxTermos() {
    cy.get(this.seletores.checkboxTermos)
      .should('be.visible')
      .uncheck({ force: true });
  }

  /**
   * Preenche formulário completo de cadastro
   * @param {string} nome - Nome do usuário
   * @param {string} email - Email do usuário
   * @param {string} telefone - Telefone do usuário
   * @param {string} senha - Senha do usuário
   * @param {string} confirmaSenha - Confirmação de senha
   */
  preencherCadastro(nome, email, telefone, senha, confirmaSenha) {
    this.preencherNome(nome);
    this.preencherEmail(email);
    this.preencherTelefone(telefone);
    this.preencherSenha(senha);
    this.preencherConfirmaSenha(confirmaSenha);
    this.marcarCheckboxTermos();
  }

  // ===== MÉTODOS DE AÇÃO =====

  /**
   * Clica no botão de cadastro
   */
  clicarBotaoCadastro() {
    cy.get(this.seletores.botaoCadastro)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  /**
   * Limpa manualmente o formulário de cadastro
   */
  clicarBotaoLimpar() {
    cy.get(this.seletores.campNome).clear();
    cy.get(this.seletores.campoEmail).clear();
    cy.get(this.seletores.campoTelefone).clear();
    cy.get(this.seletores.campoSenha).clear();
    cy.get(this.seletores.campoConfirmaSenha).clear();
    cy.get(this.seletores.checkboxTermos).uncheck({ force: true });
  }

  /**
   * Navega de volta para a página de login
   */
  clicarBotaoVoltar() {
    cy.get(this.seletores.botaoVoltar, { timeout: 10000 })
      .should('be.visible')
      .click();
  }

  /**
   * Realiza cadastro completo
   * @param {string} nome - Nome do usuário
   * @param {string} email - Email do usuário
   * @param {string} telefone - Telefone do usuário
   * @param {string} senha - Senha do usuário
   * @param {string} confirmaSenha - Confirmação de senha
   */
  fazerCadastro(nome, email, telefone, senha, confirmaSenha) {
    this.preencherCadastro(nome, email, telefone, senha, confirmaSenha);
    this.clicarBotaoCadastro();
  }

  // ===== MÉTODOS DE VALIDAÇÃO =====

  /**
   * Valida que o cadastro foi realizado com sucesso
   * @param {string} nomeEsperado - Nome esperado após cadastro
   */
  validarCadastroSucesso(nomeEsperado) {
    cy.url()
      .should('include', 'dashboard')
      .and('not.include', 'cadastro');
    
    cy.get(this.seletores.nomeUsuario)
      .should('be.visible')
      .should('contain', nomeEsperado);
    
    cy.get(this.seletores.mensagemErro).should('not.exist');
  }

  /**
   * Valida mensagem de erro em campo específico
   * @param {string} campo - Campo que apresentou erro
   * @param {string} mensagem - Mensagem de erro esperada
   */
  validarErro(campo, mensagem) {
    const campoErro = {
      nome: this.seletores.validacaoNome,
      email: this.seletores.validacaoEmail,
      telefone: this.seletores.validacaoTelefone,
      senha: this.seletores.validacaoSenha,
      confirmaSenha: this.seletores.validacaoConfirmaSenha,
      termos: this.seletores.validacaoTermos,
    };

    const feedbackAssertion = cy.get(campoErro[campo])
      .closest('.mb-3')
      .find('.invalid-feedback')
      .should('exist')
      .should('contain', mensagem);

    if (campo !== 'senha' && campo !== 'termos') {
      feedbackAssertion.should('be.visible');
    }
  }

  /**
   * Valida que o formulário está limpo/vazio
   */
  validarFormularioVazio() {
    cy.get(this.seletores.campNome).should('have.value', '');
    cy.get(this.seletores.campoEmail).should('have.value', '');
    cy.get(this.seletores.campoTelefone).should('have.value', '');
    cy.get(this.seletores.campoSenha).should('have.value', '');
    cy.get(this.seletores.campoConfirmaSenha).should('have.value', '');
    cy.get(this.seletores.checkboxTermos).should('not.be.checked');
  }

  /**
   * Valida que o botão de cadastro está desabilitado
   */
  validarBotaoDesabilitado() {
    cy.get(this.seletores.botaoCadastro)
      .should('be.disabled');
  }

  /**
   * Aguarda o carregamento terminar
   */
  aguardarCarregamento() {
    cy.get(this.seletores.carregando, { timeout: 10000 }).should('not.exist');
  }
}

export default new CadastroPage();
