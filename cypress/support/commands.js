/**
 * Comandos Customizados do Cypress
 * Comandos reutilizáveis para automação de testes
 */

// ===== COMANDOS DE LOGIN =====

/**
 * Comando: Realiza login
 * Uso: cy.login(email, senha)
 */
Cypress.Commands.add('login', (email, senha) => {
  cy.intercept('POST', '**/api/login').as('loginRequest');
  
  cy.get('#email').clear().type(email, { delay: 50 });
  cy.get('#password').clear().type(senha, { delay: 50 });
  cy.get('#login-btn').click();
  
  cy.wait('@loginRequest', { timeout: 10000 });
});

/**
 * Comando: Realiza login via API (mais rápido para setup)
 * Uso: cy.loginViaAPI(email, senha)
 */
Cypress.Commands.add('loginViaAPI', (email, senha) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.config().baseUrl}/api/login`,
    body: {
      email: email,
      password: senha,
    },
  }).then((response) => {
    expect(response.status).to.eq(200);
    localStorage.setItem('authToken', response.body.token);
    localStorage.setItem('userId', response.body.id);
    localStorage.setItem('userName', response.body.name);
    localStorage.setItem('isAdmin', response.body.isAdmin || false);
  });
});

// ===== COMANDOS DE CADASTRO =====

/**
 * Comando: Preenche formulário de cadastro
 * Uso: cy.preencherCadastro(nome, email, telefone, senha, confirmaSenha)
 */
Cypress.Commands.add('preencherCadastro', (nome, email, telefone, senha, confirmaSenha) => {
  cy.get('#name').clear().type(nome, { delay: 50 });
  cy.get('#email').clear().type(email, { delay: 50 });
  cy.get('#phone').clear().type(telefone, { delay: 50 });
  cy.get('#password').clear().type(senha, { delay: 50 });
  cy.get('#confirm-password').clear().type(confirmaSenha, { delay: 50 });
  cy.get('#terms-agreement').check({ force: true });
});

/**
 * Comando: Realiza cadastro completo
 * Uso: cy.fazerCadastro(nome, email, telefone, senha, confirmaSenha)
 */
Cypress.Commands.add('fazerCadastro', (nome, email, telefone, senha, confirmaSenha) => {
  cy.preencherCadastro(nome, email, telefone, senha, confirmaSenha);
  cy.get('#register-btn').click();
});

/**
 * Comando: Realiza cadastro via API
 * Uso: cy.cadastroViaAPI(nome, email, telefone, senha)
 */
Cypress.Commands.add('cadastroViaAPI', (nome, email, telefone, senha) => {
  cy.request({
    method: 'POST',
    url: `${Cypress.config().baseUrl}/api/register`,
    body: {
      name: nome,
      email: email,
      phone: telefone,
      password: senha,
    },
  }).then((response) => {
    expect(response.status).to.eq(201);
  });
});

// ===== COMANDOS DE UTILITÁRIOS =====

/**
 * Comando: Aguarda elemento e clica
 * Uso: cy.clicarAposAguardar(seletor, timeout)
 */
Cypress.Commands.add('clicarAposAguardar', (seletor, timeout = 5000) => {
  cy.get(seletor, { timeout: timeout })
    .should('be.visible')
    .should('not.be.disabled')
    .click();
});

/**
 * Comando: Aguarda elemento e preenche
 * Uso: cy.preencherAposAguardar(seletor, valor, timeout)
 */
Cypress.Commands.add('preencherAposAguardar', (seletor, valor, timeout = 5000) => {
  cy.get(seletor, { timeout: timeout })
    .should('be.visible')
    .clear()
    .type(valor, { delay: 50 });
});

/**
 * Comando: Limpa localStorage e sessionStorage
 * Uso: cy.limparArmazenamento()
 */
Cypress.Commands.add('limparArmazenamento', () => {
  localStorage.clear();
  sessionStorage.clear();
});

/**
 * Comando: Faz logout
 * Uso: cy.logout()
 */
Cypress.Commands.add('logout', () => {
  cy.limparArmazenamento();
  cy.visit('/login.html');
});

/**
 * Comando: Aguarda API responder
 * Uso: cy.aguardarAPI(metodo, url, alias)
 */
Cypress.Commands.add('aguardarAPI', (metodo, url, alias) => {
  cy.intercept(metodo, url).as(alias);
  cy.wait(`@${alias}`, { timeout: 10000 });
});

/**
 * Comando: Valida campo de erro
 * Uso: cy.validarErrosCampo(seletor, mensagem)
 */
Cypress.Commands.add('validarErrosCampo', (seletor, mensagem) => {
  cy.get(seletor)
    .should('be.visible')
    .should('contain', mensagem);
});

/**
 * Comando: Gera email único com timestamp
 * Uso: cy.gerarEmailUnico(prefixo)
 */
Cypress.Commands.add('gerarEmailUnico', (prefixo = 'teste') => {
  const emailUnico = `${prefixo}${Date.now()}@teste.com`;
  cy.log(`📧 Email gerado: ${emailUnico}`);
  return emailUnico;
});

// ===== COMANDOS DE CARRINHO =====

/**
 * Comando: Busca e seleciona um livro pelo título
 * Uso: cy.buscarLivro(titulo)
 */
Cypress.Commands.add('buscarLivro', (titulo) => {
  cy.contains('.card-title', titulo, { timeout: 10000 })
    .should('be.visible')
    .closest('.card')
    .as('livroCard');
});

/**
 * Comando: Adiciona um livro ao carrinho
 * Uso: cy.adicionarLivroCarrinho()
 */
Cypress.Commands.add('adicionarLivroCarrinho', () => {
  cy.get('@livroCard')
    .find('.add-to-cart')
    .should('be.visible')
    .click();
});

/**
 * Comando: Adiciona múltiplos livros ao carrinho
 * Uso: cy.adicionarMultiplosLivros(['Livro 1', 'Livro 2'])
 */
Cypress.Commands.add('adicionarMultiplosLivros', (titulos) => {
  titulos.forEach((titulo) => {
    cy.buscarLivro(titulo);
    cy.adicionarLivroCarrinho();
    cy.wait(500); // Pequena pausa entre adições
  });
});

/**
 * Comando: Abre o carrinho
 * Uso: cy.abrirCarrinho()
 */
Cypress.Commands.add('abrirCarrinho', () => {
  cy.get('a[href="/basket.html"]', { timeout: 10000 })
    .should('be.visible')
    .click();
  cy.url().should('include', '/basket.html');
  cy.get('body', { timeout: 10000 }).then(($body) => {
    if ($body.find('#cart-content').length) {
      cy.get('#cart-content').should('be.visible');
    }
    if ($body.find('#empty-cart').length) {
      cy.get('#empty-cart').should('be.visible');
    }
  });
});

/**
 * Comando: Remove um livro do carrinho
 * Uso: cy.removerDoCarrinho('Título do Livro')
 */
Cypress.Commands.add('removerDoCarrinho', (titulo) => {
  cy.on('window:confirm', () => true);

  cy.contains('.card-title', titulo)
    .closest('.card')
    .find('.remove-btn')
    .click();
});

/**
 * Comando: Limpa o carrinho completamente
 * Uso: cy.limparCarrinho()
 */
Cypress.Commands.add('limparCarrinho', () => {
  cy.on('window:confirm', () => true);
  cy.get('#clear-cart-btn')
    .should('be.visible')
    .click();
});

/**
 * Comando: Valida quantidade de itens no carrinho
 * Uso: cy.validarQtdCarrinho(3)
 */
Cypress.Commands.add('validarQtdCarrinho', (quantidade) => {
  cy.get('#cart-count')
    .should('be.visible')
    .should('contain', quantidade);
});

/**
 * Comando: Processa a compra (checkout)
 * Uso: cy.fazerCheckout()
 */
Cypress.Commands.add('fazerCheckout', () => {
  cy.get('#checkout-btn')
    .should('be.visible')
    .click();
  cy.url().should('include', '/checkout.html');
});

// ===== OVERRIDE - Melhorias de Segurança =====

/**
 * Override: Desabilita exceções não capturadas para testes mais robustos
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignora erros específicos do aplicativo
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Network request failed')
  ) {
    return false;
  }
});
