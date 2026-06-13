# 🛒 Suite de Testes - Carrinho de Livros

Documentação completa da suite de testes `carrinho-livros.cy.js` para a funcionalidade de carrinho de uma biblioteca digital.

---

## 📋 Visão Geral

Esta suite cobre os principais fluxos relacionados ao carrinho de livros:
- ✅ **Fluxos Positivos**: Adicionar livros, múltiplas quantidades, remover
- ❌ **Fluxos Negativos**: Sem login, livros esgotados, quantidade inválida
- 🔄 **Fluxos Completos**: Integração e sequências complexas
- ⚡ **Performance & UX**: Comportamento da interface

---

## 🎯 Casos de Teste

### ✅ Fluxos Positivos (4 testes)

| Teste | Descrição | Validates |
|-------|-----------|-----------|
| Adicionar um livro | Adiciona um livro com sucesso | Badge, mensagem, carrinho |
| Adicionar múltiplos livros | Adiciona 3 livros diferentes | Quantidade total, todos visíveis |
| Adicionar múltiplas quantidades | Adiciona quantidade > 1 | Quantidade correta no carrinho |
| Remover livro | Remove um livro do carrinho | Livro não apareça mais |

### ❌ Fluxos Negativos (4 testes)

| Teste | Descrição | Validates |
|-------|-----------|-----------|
| Sem login | Tenta adicionar sem autenticar | Mensagem "login requerido" |
| Livro esgotado | Tenta adicionar livro indisponível | Botão desabilitado, indicador |
| Carrinho vazio | Tenta comprar sem itens | Botão desabilitado, mensagem |
| Quantidade excessiva | Adiciona mais que disponível | Mensagem de erro com limite |

### 🔄 Fluxos Completos (2 testes)

| Teste | Descrição | Valida |
|-------|-----------|--------|
| Adicionar → Verificar → Remover | Fluxo completo com cleanup | Estado em cada etapa |
| Alterar quantidade | Modifica quantidade de livro | Atualização em tempo real |

### ⚡ Performance & UX (2 testes)

| Teste | Descrição | Valida |
|-------|-----------|--------|
| Badge em tempo real | Badge atualiza ao adicionar | Contagem correta |
| Desabilitar durante requisição | Botão responsável durante API | Estado apropriado |

**Total: 12 testes**

---

## 📁 Arquivos Relacionados

```
cypress-portfolio/
├── e2e/
│   └── carrinho-livros.cy.js          ← Suite principal
├── fixtures/
│   └── livros.json                    ← Dados de teste
├── support/
│   ├── pages/
│   │   └── carrinho-page.js           ← Page Object
│   └── commands.js                    ← Comandos customizados
```

---

## 🔧 Como Executar

### Rodar todos os testes
```bash
npm run cypress:run
```

### Rodar apenas carrinho
```bash
npx cypress run --spec "cypress/e2e/carrinho-livros.cy.js"
```

### Rodar com interface gráfica
```bash
npm run cypress:open
# Então selecione "carrinho-livros.cy.js"
```

### Rodar grupos específicos
```bash
# Apenas testes positivos
npx cypress run --spec "cypress/e2e/carrinho-livros.cy.js" --grep "Fluxos Positivos"

# Apenas testes negativos
npx cypress run --spec "cypress/e2e/carrinho-livros.cy.js" --grep "Fluxos Negativos"
```

---

## 📚 Estrutura de Testes (AAA Pattern)

Cada teste segue o padrão AAA:

```javascript
it('✅ Deve adicionar um livro ao carrinho com sucesso', () => {
  // ARRANGE - Preparar dados e mocks
  const livroSelecionado = livros.livrosValidos[0];
  cy.intercept('POST', '**/api/carrinho/adicionar', {
    statusCode: 200,
    body: { sucesso: true, mensagem: 'Livro adicionado com sucesso' }
  }).as('adicionarLivro');

  // ACT - Executar a ação
  carrinhoPage.buscarLivroPorTitulo(livroSelecionado.titulo);
  carrinhoPage.adicionarAoCarrinho();
  cy.wait('@adicionarLivro');

  // ASSERT - Validar resultado
  carrinhoPage.validarMensagemSucesso('Livro adicionado com sucesso');
  carrinhoPage.validarQuantidadeItens(1);
})
```

---

## 🛠️ Page Object: CarrinhoPage

### Métodos de Ação

```javascript
// Navegação
carrinhoPage.visitarPaginaPrincipal()
carrinhoPage.abrirCarrinho()

// Busca
carrinhoPage.buscarLivroPorTitulo(titulo)
carrinhoPage.encontrarLivro(seletor)

// Adição
carrinhoPage.adicionarAoCarrinho()
carrinhoPage.definirQuantidade(quantidade)
carrinhoPage.aumentarQuantidade(vezes)

// Remoção
carrinhoPage.removerDoCarrinho(titulo)
carrinhoPage.limparCarrinho()

// Compra
carrinhoPage.clicarComprar()
carrinhoPage.confirmarAcao()
```

### Métodos de Validação

```javascript
// Validação de sucesso
carrinhoPage.validarLivroNoCarrinho(titulo)
carrinhoPage.validarQuantidadeItens(qtd)
carrinhoPage.validarResumo(totalItens, valorTotal)

// Validação de restrições
carrinhoPage.validarLivroEsgotado(titulo)
carrinhoPage.validarCarrinhoVazio()
carrinhoPage.validarBotaoComprarDesabilitado()

// Validação de mensagens
carrinhoPage.validarMensagemSucesso(mensagem)
carrinhoPage.validarMensagemErro(mensagem)
carrinhoPage.validarMensagemLoginRequerido()
```

---

## 📊 Fixture: livros.json

```json
{
  "livrosValidos": [
    {
      "id": 1,
      "titulo": "Clean Code",
      "preco": 89.90,
      "disponibilidade": true,
      "quantidade": 5
    },
    // ... mais livros
  ],
  "livroEsgotado": {
    "id": 4,
    "titulo": "JavaScript: The Good Parts",
    "disponibilidade": false,
    "quantidade": 0
  }
}
```

---

## 🔗 Comandos Customizados

Comandos úteis definidos em `support/commands.js`:

```javascript
// Busca e adição
cy.buscarLivro(titulo)
cy.adicionarLivroCarrinho()
cy.adicionarMultiplosLivros(['Livro 1', 'Livro 2'])

// Carrinho
cy.abrirCarrinho()
cy.removerDoCarrinho(titulo)
cy.limparCarrinho()

// Validação
cy.validarQtdCarrinho(quantidade)

// Checkout
cy.fazerCheckout()
```

---

## 🧪 Boas Práticas Aplicadas

✅ **Page Object Pattern**
- Encapsulamento de seletores e ações
- Fácil manutenção quando UI muda

✅ **Fixtures para Dados**
- Dados centralizados e reutilizáveis
- Sem hardcoding

✅ **Comandos Customizados**
- Ações repetidas encapsuladas
- Código mais legível

✅ **Intercept & Mock APIs**
- Testes determinísticos
- Sem dependência de backend real
- Simular diferentes cenários (erro, delay, etc)

✅ **beforeEach Setup**
- Estado limpo para cada teste
- Sem interferência entre testes

✅ **Padrão AAA**
- Arrange (preparar)
- Act (agir)
- Assert (validar)

✅ **Sem Waits Fixos**
- Usar `cy.wait()` para requisições
- Usar `should()` para elementos
- Timeouts implícitos

✅ **Comentários em Português**
- Fácil compreensão
- Documentação inline

---

## 🎨 Emojis Utilizados

| Emoji | Significado |
|-------|------------|
| 🛒 | Carrinho/ecommerce |
| ✅ | Teste positivo |
| ❌ | Teste negativo |
| 🔄 | Fluxo/ciclo |
| ⚡ | Performance |
| 📋 | Documentação |
| 🎯 | Objetivo |
| 📁 | Arquivo/pasta |

---

## 🚨 Troubleshooting

### Problema: Teste falha por "elemento não encontrado"
**Solução**: Verifique se os seletores `data-cy` estão corretos no seu HTML

### Problema: Intercept não funciona
**Solução**: Certifique-se de que o intercept está definido ANTES da ação que o dispara

### Problema: Múltiplos testes passam isolados mas falham em sequência
**Solução**: Verifique se o `beforeEach` está limpando o estado corretamente

### Problema: Badge de quantidade não atualiza
**Solução**: Adicione delay ou aguarde a resposta da API com `cy.wait()`

---

## 📈 Métricas Esperadas

- **Total de Testes**: 12
- **Taxa de Aprovação**: > 95% (em ambiente estável)
- **Tempo de Execução**: ~30-40 segundos (com mocks)
- **Cobertura de Funcionalidade**: ~85% do carrinho

---

## 🔐 Dependências

- **Cypress**: ^15.0.0
- **Dados de Teste**: `fixtures/livros.json`
- **Page Object**: `pages/carrinho-page.js`
- **Comandos**: `support/commands.js`

---

## ✨ Exemplo Completo de Uso

```javascript
// Login (usar em beforeEach se necessário)
cy.login('usuario@teste.com', 'senha123');

// Buscar e adicionar livro
cy.buscarLivro('Clean Code');
cy.adicionarLivroCarrinho();

// Validar
cy.validarQtdCarrinho(1);

// Abrir e verificar
carrinhoPage.abrirCarrinho();
carrinhoPage.validarLivroNoCarrinho('Clean Code');

// Checkout
cy.fazerCheckout();
```

---

## 📝 Manutenção

### Quando Adicionar Novo Teste
1. Use o padrão AAA
2. Adicione comentários explicativos
3. Use fixtures para dados
4. Verifique se Page Object já tem método necessário
5. Documente no README (este arquivo)

### Quando Atualizar Seletores
1. Atualize `seletores` no `carrinho-page.js`
2. Todos os testes que usam esse seletor serão atualizados automaticamente
3. Nenhuma mudança necessária nos testes individuais

### Quando Adicionar Novo Comando
1. Defina em `support/commands.js`
2. Documente o uso (comentário JSDoc)
3. Atualize a seção "Comandos Customizados" deste README

---

## 🎓 Recursos Adicionais

- [Documentação Cypress](https://docs.cypress.io/)
- [Page Object Pattern](https://docs.cypress.io/guides/references/best-practices)
- [Intercept & Stubbing](https://docs.cypress.io/api/commands/intercept)
- [ARQUITETURA.md](../docs/ARQUITETURA.md) - Arquitetura geral do projeto

---

**Versão**: 1.0  
**Última Atualização**: Maio 2026  
**Mantido por**: QA Team
