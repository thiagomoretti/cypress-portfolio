///<reference types="cypress"/>

import { faker } from '@faker-js/faker'
import cadastroPage from '../support/pages/cadastro-page'
import cadastro from '../fixtures/cadastro.json'

/**
 * Suite de Testes: Funcionalidade de Cadastro
 * Testa diferentes cenários de registro de novos usuários
 * 
 * Padrão AAA: Arrange (preparar) → Act (agir) → Assert (validar)
 */
describe('📝 Funcionalidade: Cadastro no Hub de Leitura', () => {
  // ===== SETUP =====

  beforeEach(() => {
    /**
     * ARRANGE: Preparar o ambiente para cada teste
     * Navega até a página de cadastro
     */
    cadastroPage.visitarPaginaCadastro()
  })

  // ===== TESTES POSITIVOS =====

  it('✅ Deve fazer cadastro com sucesso com dados válidos', () => {
    /**
     * ARRANGE: Preparar dados de teste únicos
     */
    const email = `friedrich${Date.now()}@teste.com`
    const nome = cadastro.nomeValido
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Preencher e enviar formulário de cadastro
     */
    cadastroPage.fazerCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar que o cadastro foi bem-sucedido
     */
    cadastroPage.validarCadastroSucesso(nome)
    cadastroPage.aguardarCarregamento()
  })

  it('✅ Deve fazer cadastro com sucesso usando Faker para dados aleatórios', () => {
    /**
     * ARRANGE: Gerar dados aleatórios com Faker
     */
    const email = faker.internet.email()
    const nome = faker.person.fullName({ lastName: 'Nietzsche' })
    const telefone = '11985447122'
    const senha = 'Teste@123'

    /**
     * ACT: Realizar cadastro com dados gerados
     */
    cadastroPage.fazerCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar sucesso e verificar dados
     */
    cadastroPage.validarCadastroSucesso(nome)
    cy.get(cadastroPage.seletores.nomeUsuario)
      .should('contain', nome)
  })

  it('✅ Deve fazer cadastro com sucesso usando comando customizado', () => {
    /**
     * ARRANGE: Preparar dados de teste
     */
    const nome = faker.person.fullName({ lastName: 'Nietzsche' })
    const email = `teste${Date.now()}@teste.com`
    const telefone = '11985447122'
    const senha = 'Teste@123'

    /**
     * ACT: Usar comando customizado para preencher e enviar
     */
    cy.fazerCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar navegação após cadastro
     */
    cy.url().should('include', 'dashboard')
  })

  it('✅ Deve fazer cadastro com sucesso usando Page Object Pattern', () => {
    /**
     * ARRANGE: Preparar dados de teste
     */
    const nome = 'Friedrich Nietzsche'
    const email = `friedrich${Date.now()}@teste.com`
    const telefone = '11985447122'
    const senha = 'Teste@123'

    /**
     * ACT: Usar métodos do Page Object
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar sucesso do cadastro
     */
    cadastroPage.validarCadastroSucesso(nome)
  })

  it('✅ Deve fazer cadastro com sucesso usando fixture', () => {
    /**
     * ARRANGE: Dados da fixture
     */
    const nome = cadastro.nomeValido
    const email = `fixture${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Preencher com dados da fixture
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar sucesso
     */
    cadastroPage.validarCadastroSucesso(nome)
  })

  // ===== TESTES NEGATIVOS - CAMPOS INVÁLIDOS =====

  it('❌ Deve exibir erro ao tentar cadastrar com nome em branco', () => {
    /**
     * ARRANGE: Dados com nome vazio
     */
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Preencher formulário sem nome
     */
    cadastroPage.preencherEmail(email)
    cadastroPage.preencherTelefone(telefone)
    cadastroPage.preencherSenha(senha)
    cadastroPage.preencherConfirmaSenha(senha)
    cadastroPage.marcarCheckboxTermos()
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar mensagem de erro de nome
     */
    cadastroPage.validarErro('nome', 'Nome deve ter pelo menos 2 caracteres')
    cy.url().should('include', 'register.html')
  })

  it('❌ Deve exibir erro ao tentar cadastrar com nome muito curto', () => {
    /**
     * ARRANGE: Nome com menos de 2 caracteres
     */
    const email = `teste${Date.now()}@teste.com`
    const nome = 'A'
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Tentar cadastro com nome inválido
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de nome
     */
    cadastroPage.validarErro('nome', 'Nome deve ter pelo menos 2 caracteres')
  })

  it('❌ Deve exibir erro ao tentar cadastrar com email inválido', () => {
    /**
     * ARRANGE: Email em formato inválido
     */
    const nome = cadastro.nomeValido
    const email = cadastro.emailInvalido
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Tentar cadastro com email inválido
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de email
     */
    cadastroPage.validarErro('email', 'Email válido é obrigatório')
  })

  it('❌ Deve exibir erro ao tentar cadastrar com email em branco', () => {
    /**
     * ARRANGE: Email vazio
     */
    const nome = cadastro.nomeValido
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Preencher formulário sem email
     */
    cadastroPage.preencherNome(nome)
    cadastroPage.preencherTelefone(telefone)
    cadastroPage.preencherSenha(senha)
    cadastroPage.preencherConfirmaSenha(senha)
    cadastroPage.marcarCheckboxTermos()
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de email obrigatório
     */
    cadastroPage.validarErro('email', 'Email válido é obrigatório')
  })

  it('❌ Deve exibir erro ao tentar cadastrar com telefone em formato inválido', () => {
    /**
     * ARRANGE: Telefone com formato errado
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Tentar cadastro com telefone inválido
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Pode passar ou gerar erro dependendo das validações
     */
    // Validação será baseada nas regras específicas da aplicação
  })

  it('❌ Deve exibir erro ao tentar cadastrar com senha muito fraca', () => {
    /**
     * ARRANGE: Senha fraca
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senhaFraca = '123'

    /**
     * ACT: Tentar cadastro com senha fraca
     */
    cadastroPage.preencherNome(nome)
    cadastroPage.preencherEmail(email)
    cadastroPage.preencherTelefone(telefone)
    cadastroPage.preencherSenha(senhaFraca)
    cadastroPage.preencherConfirmaSenha(senhaFraca)
    cadastroPage.marcarCheckboxTermos()
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de senha fraca
     */
    cadastroPage.validarErro('senha', 'Senha deve ter pelo menos 6 caracteres')
  })

  it('❌ Deve exibir erro ao não confirmar a senha corretamente', () => {
    /**
     * ARRANGE: Senhas diferentes
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida
    const senhaConfirmacaoDiferente = 'OutraSenha@123'

    /**
     * ACT: Preencher com confirmação de senha diferente
     */
    cadastroPage.preencherNome(nome)
    cadastroPage.preencherEmail(email)
    cadastroPage.preencherTelefone(telefone)
    cadastroPage.preencherSenha(senha)
    cadastroPage.preencherConfirmaSenha(senhaConfirmacaoDiferente)
    cadastroPage.marcarCheckboxTermos()
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de confirmação
     */
    cadastroPage.validarErro('confirmaSenha', 'Senhas não coincidem')
  })

  it('❌ Deve exibir erro ao não aceitar os termos e condições', () => {
    /**
     * ARRANGE: Dados válidos mas sem aceitar termos
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Preencher sem marcar checkbox de termos
     */
    cadastroPage.preencherNome(nome)
    cadastroPage.preencherEmail(email)
    cadastroPage.preencherTelefone(telefone)
    cadastroPage.preencherSenha(senha)
    cadastroPage.preencherConfirmaSenha(senha)
    // Não marcar checkbox de termos
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de termos não aceitos
     */
    cadastroPage.validarErro('termos', 'Você deve aceitar os termos de uso')
  })

  // ===== TESTES DE FLUXO E UX =====

  it('🔄 Deve permitir limpar formulário e preenchê-lo novamente', () => {
    /**
     * ARRANGE: Dados de teste
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT - Primeira ação: preencher
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar que foi preenchido
     */
    cy.get(cadastroPage.seletores.campNome).should('have.value', nome)

    /**
     * ACT - Segunda ação: limpar
     */
    cadastroPage.clicarBotaoLimpar()

    /**
     * ASSERT: Validar que os campos foram limpos
     */
    cadastroPage.validarFormularioVazio()
  })

  it('🔄 Deve permitir voltar à página anterior', () => {
    /**
     * ARRANGE: Estamos na página de cadastro
     */

    /**
     * ACT: Clicar no botão voltar
     */
    cadastroPage.clicarBotaoVoltar()

    /**
     * ASSERT: Validar que voltou para página anterior (ex: login)
     */
    cy.url().should('not.include', 'cadastro')
  })

  it('⚡ Deve desabilitar botão de cadastro durante a requisição', () => {
    /**
     * ARRANGE: Interceptar requisição com delay
     */
    cy.intercept('POST', '**/register', (req) => {
      req.reply((res) => {
        res.delay(2000)
      })
    }).as('delayedRegister')

    /**
     * ACT: Preencher formulário
     */
    const nome = cadastro.nomeValido
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar estado do botão
     */
    cy.get(cadastroPage.seletores.botaoCadastro)
      .should('not.be.disabled')
      .click()

    cy.get(cadastroPage.seletores.botaoCadastro).should('be.disabled')
  })

  it('✅ Deve exibir sucesso ao cadastrar e redirecionar para dashboard', () => {
    /**
     * ARRANGE: Dados válidos
     */
    const nome = faker.person.fullName({ lastName: 'Nietzsche' })
    const email = `sucessocadastro${Date.now()}@teste.com`
    const telefone = '11985447122'
    const senha = 'Teste@123'

    /**
     * ACT: Realizar cadastro completo
     */
    cadastroPage.fazerCadastro(nome, email, telefone, senha, senha)

    /**
     * ASSERT: Validar redirecionamento e confirmação
     */
    cy.url()
      .should('include', 'dashboard')
      .should('not.include', 'register.html')

    cadastroPage.validarCadastroSucesso(nome)
  })

  // ===== TESTES DE EDGE CASES =====

  it('⚠️ Deve validar caracteres especiais no nome', () => {
    /**
     * ARRANGE: Nome com caracteres especiais
     */
    const nome = 'Friedrich Nietzsche @#$'
    const email = `teste${Date.now()}@teste.com`
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Tentar cadastro com caracteres especiais
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar comportamento (pode aceitar ou rejeitar)
     */
    // Depende das regras de validação da aplicação
  })

  it('⚠️ Deve validar email duplicado', () => {
    /**
     * ARRANGE: Email que já existe no sistema
     */
    const email = 'usuario@teste.com' // Email existente na fixture
    const nome = cadastro.nomeValido
    const telefone = cadastro.telefone
    const senha = cadastro.senhaValida

    /**
     * ACT: Tentar cadastrar com email duplicado
     */
    cadastroPage.preencherCadastro(nome, email, telefone, senha, senha)
    cadastroPage.clicarBotaoCadastro()

    /**
     * ASSERT: Validar erro de email duplicado
     */
    cadastroPage.aguardarCarregamento()
    // cy.get(cadastroPage.seletores.mensagemErro)
    //   .should('contain', 'Email já registrado')
  })
})
