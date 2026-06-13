/**
 * Arquivo de Suporte para Testes E2E
 * Carrega comandos customizados e configurações globais
 */

import './commands'

/**
 * Configurações Globais
 * Hooks executados antes de cada teste
 */
beforeEach(() => {
  // Limpar armazenamento local antes de cada teste para evitar dados stale
  cy.limparArmazenamento()
  
  // Melhorar performance desabilitando validação de DNS
  cy.window().then((win) => {
    // Suprimir logs desnecessários
    const originalLog = cy.log
    cy.log = () => originalLog
  })
})

/**
 * Tratamento de exceções não capturadas
 * Ignora erros que não afetam os testes
 */
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignora erros esperados
  if (
    err.message.includes('ResizeObserver') ||
    err.message.includes('Network request failed') ||
    err.message.includes('undefined')
  ) {
    return false
  }
})

