const { defineConfig } = require('cypress')

/**
 * Configuração Cypress - Projeto Portfolio
 * Configurações otimizadas para Clean Test Architecture
 */
module.exports = defineConfig({
  projectId: 'a6xued',
  
  // ===== CONFIGURAÇÕES GLOBAIS =====
  defaultCommandTimeout: 10000,
  requestTimeout: 10000,
  responseTimeout: 10000,
  
  // ===== VIEWPORT =====
  viewportWidth: 1280,
  viewportHeight: 720,
  
  // ===== REPORTE E VÍDEOS =====
  video: false,
  screenshotOnRunFailure: true,
  
  // ===== E2E CONFIGURATION =====
  e2e: {
    // URL base para todos os testes
    baseUrl: 'http://localhost:3000',
    
    // Globais de teste
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    // Waits e timeouts
    requestTimeout: 10000,
    responseTimeout: 10000,
    defaultCommandTimeout: 10000,
    
    // Retries em CI
    retries: {
      runMode: 1,    // 1 retry em modo de execução
      openMode: 0,   // Sem retry em modo interativo
    },

    /**
     * Node Event Listeners
     * Setup inicial para testes
     */
    setupNodeEvents(on, config) {
      // Exemplo: pode ser usado para tasks customizadas
      
      // Task para logs
      on('task', {
        log(message) {
          console.log(message)
          return null
        },
        table(data) {
          console.table(data)
          return null
        },
      })

      return config
    },

    /**
     * Headers padrão
     */
    headers: {
      'Accept': 'application/json',
    },

    /**
     * Configurações de segurança
     */
    modifyObstructiveCode: true,
    chromeWebSecurity: false, // Para testes locais
  },

  // ===== COMPONENT CONFIGURATION (OPCIONAL) =====
  component: {
    devServer: {
      framework: 'react',
      bundler: 'webpack',
    },
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
  },

  // ===== REPORTER =====
  reporter: 'spec',
  reporterOptions: {
    charts: true,
    reportDir: 'cypress/results',
  },

  // ===== ENVIRONMENT VARIABLES =====
  env: {
    apiUrl: 'http://localhost:3000/api',
    apiTimeout: 10000,
  },
})

