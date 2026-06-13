/**
 * Page Object - Página do Carrinho de Livros
 * Encapsula todos os elementos e ações relacionados ao carrinho
 */

class CarrinhoPage {
  // ===== SELETORES =====
  seletores = {
    botaoAdicionar: '.add-to-cart',
    botaoRemover: '.remove-btn',
    botaoVerCarrinho: 'header a[href="/basket.html"]',
    badgeQuantidade: '#cart-count',
    containerCarrinho: '#cart-content',
    listaItensCarrinho: '#cart-list',
    itemCarrinho: '.card.book-item',
    botaoLimparCarrinho: '#clear-cart-btn',
    botaoComprar: '#checkout-btn',
    mensagemAlerta: '#global-alert-container, #alert-container',
    carrinhoVazio: '#empty-cart',
    carregando: '#loading',
  };

  // ===== MÉTODOS DE NAVEGAÇÃO =====

  /**
   * Visita a página principal do catálogo
   */
  visitarPaginaPrincipal() {
    cy.visit('/catalog.html');
    cy.title().should('include', 'Catálogo');
    cy.contains('Conheça Nosso', { timeout: 10000 }).should('be.visible');
    cy.get(this.seletores.carregando, { timeout: 10000 }).should('not.be.visible');
  }

  /**
   * Abre a visualização do carrinho
   */
  abrirCarrinho() {
    cy.get(this.seletores.botaoVerCarrinho, { timeout: 10000 })
      .first()
      .should('be.visible')
      .click();

    cy.url().should('include', '/basket.html');
    cy.get(this.seletores.carregando, { timeout: 10000 }).should('not.be.visible');
    cy.get('body', { timeout: 10000 }).then(($body) => {
      const cartContentVisible = $body.find(this.seletores.containerCarrinho).is(':visible');
      if (cartContentVisible) {
        cy.get(this.seletores.containerCarrinho).should('be.visible');
      } else {
        cy.get(this.seletores.carrinhoVazio).should('be.visible');
      }
    });
  }

  // ===== MÉTODOS DE BUSCA =====

  /**
   * Busca e encontra um livro pelo título
   * @param {string} titulo - Título do livro
   */
  buscarLivroPorTitulo(titulo) {
    cy.contains('.card-title', titulo, { timeout: 10000 })
      .should('be.visible')
      .closest('.card')
      .as('livroCard');
  }

  // ===== MÉTODOS DE AÇÃO =====

  /**
   * Adiciona o livro selecionado à cesta
   */
  adicionarAoCarrinho() {
    cy.get('@livroCard')
      .find(this.seletores.botaoAdicionar)
      .should('be.visible')
      .click();
  }

  adicionarLivroPorIndice(index = 0) {
    cy.get('#book-list .add-to-cart', { timeout: 10000 })
      .eq(index)
      .should('be.visible')
      .click();
  }

  adicionarMultiplosLivros(indexes = [0, 1, 2]) {
    indexes.forEach((index) => {
      cy.get('#book-list .add-to-cart', { timeout: 10000 })
        .eq(index)
        .should('be.visible')
        .click();
    });
  }

  obterTituloLivroPorIndice(index = 0) {
    return cy.get('#book-list .card-title', { timeout: 10000 })
      .eq(index)
      .invoke('text')
      .then((texto) => texto.trim());
  }

  obterTitulosLivrosPorIndices(indexes = [0, 1, 2]) {
    return cy.get('#book-list .card-title', { timeout: 10000 }).then(($titles) => {
      return indexes.map((index) => Cypress.$($titles[index]).text().trim());
    });
  }

  /**
   * Remove um livro da cesta pelo título
   * @param {string} titulo - Título do livro a remover
   */
  removerDoCarrinho(titulo) {
    cy.contains('#cart-list .card-title', titulo, { timeout: 10000 })
      .should('be.visible')
      .closest('.card.book-item')
      .find(this.seletores.botaoRemover)
      .should('be.visible')
      .click();
  }

  /**
   * Limpa todos os itens do carrinho
   */
  limparCarrinho() {
    cy.get(this.seletores.botaoLimparCarrinho, { timeout: 10000 })
      .scrollIntoView({ block: 'center' })
      .click({ force: true });
  }

  /**
   * Clica no botão de comprar
   */
  clicarComprar() {
    cy.get(this.seletores.botaoComprar)
      .should('be.visible')
      .should('not.be.disabled')
      .click();
  }

  // ===== MÉTODOS DE VALIDAÇÃO =====

  /**
   * Valida que um livro está presente no carrinho
   * @param {string} titulo - Título do livro
   */
  validarLivroNoCarrinho(titulo) {
    cy.contains('#cart-list .card-title', titulo, { timeout: 10000 })
      .should('be.visible');
  }

  /**
   * Valida a quantidade de itens exibidos no badge do cabeçalho
   * @param {number} quantidade - Quantidade esperada
   */
  validarQuantidadeItens(quantidade) {
    cy.get(this.seletores.badgeQuantidade)
      .should('be.visible')
      .should('contain', quantidade);
  }

  /**
   * Valida a presença de mensagem de sucesso
   * @param {string} mensagem - Texto esperado
   */
  validarMensagemSucesso(mensagem) {
    cy.get(this.seletores.mensagemAlerta, { timeout: 10000 })
      .should('be.visible')
      .should('contain', mensagem);
  }

  /**
   * Valida a presença de mensagem de erro
   * @param {string} mensagem - Texto esperado
   */
  validarMensagemErro(mensagem) {
    cy.get(this.seletores.mensagemAlerta, { timeout: 10000 })
      .filter(':visible')
      .should('have.length.at.least', 1)
      .first()
      .should('contain', mensagem);
  }

  /**
   * Valida que o carrinho está vazio
   */
  validarCarrinhoVazio() {
    cy.get(this.seletores.carrinhoVazio)
      .should('be.visible')
      .should('contain', 'Sua cesta está vazia');
  }

  /**
   * Valida que o botão de comprar está desabilitado ou não existe
   */
  validarBotaoComprarDesabilitado() {
    cy.get('body').then(($body) => {
      if ($body.find(this.seletores.botaoComprar).length) {
        cy.get(this.seletores.botaoComprar).should('be.disabled');
      }
    });
  }

  /**
   * Aguarda o carregamento da página terminar
   */
  aguardarCarregamento() {
    cy.get(this.seletores.carregando, { timeout: 10000 }).should('not.be.visible');
  }
}

export default new CarrinhoPage();
