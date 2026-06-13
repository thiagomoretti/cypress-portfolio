///<reference types="cypress"/>

import carrinhoPage from '../support/pages/carrinho-page'
import livros from '../fixtures/livros.json'

/**
 * Suite de Testes: Funcionalidade do Carrinho de Livros
 * Cobre os principais fluxos de adição, remoção e gerenciamento
 * de livros na cesta do Hub de Leitura.
 */

describe('🛒 Funcionalidade: Carrinho de Livros', () => {
  beforeEach(() => {
    cy.limparArmazenamento()
    carrinhoPage.visitarPaginaPrincipal()
    carrinhoPage.aguardarCarregamento()
  })

  it('✅ Deve adicionar um livro ao carrinho e exibir na cesta', () => {
    carrinhoPage.obterTituloLivroPorIndice(0).then((titulo) => {
      carrinhoPage.adicionarLivroPorIndice(0)

      carrinhoPage.validarMensagemSucesso('foi adicionado à cesta!')
      carrinhoPage.validarQuantidadeItens(1)

      carrinhoPage.abrirCarrinho()
      carrinhoPage.validarLivroNoCarrinho(titulo)
    });
  })

  it('✅ Deve adicionar múltiplos livros ao carrinho', () => {
    carrinhoPage.obterTitulosLivrosPorIndices([0, 1, 2]).then((titulos) => {
      carrinhoPage.adicionarMultiplosLivros([0, 1, 2])

      carrinhoPage.validarQuantidadeItens(3)
      carrinhoPage.abrirCarrinho()

      titulos.forEach((titulo) => {
        carrinhoPage.validarLivroNoCarrinho(titulo)
      });
    });
  })

  it('✅ Deve remover um livro da cesta', () => {
    carrinhoPage.obterTituloLivroPorIndice(0).then((titulo) => {
      carrinhoPage.adicionarLivroPorIndice(0)

      carrinhoPage.abrirCarrinho()
      cy.on('window:confirm', () => true)
      carrinhoPage.removerDoCarrinho(titulo)

      carrinhoPage.validarCarrinhoVazio()
    });
  })

  it('❌ Deve exibir carrinho vazio quando não houver itens', () => {
    carrinhoPage.abrirCarrinho()
    carrinhoPage.validarCarrinhoVazio()
  })

  it('✅ Deve limpar a cesta usando o botão Limpar', () => {
    const livro = livros.livrosValidos[1]

    carrinhoPage.adicionarLivroPorIndice(1)

    carrinhoPage.abrirCarrinho()
    cy.on('window:confirm', () => true)
    carrinhoPage.limparCarrinho()

    carrinhoPage.validarCarrinhoVazio()
  })
})
