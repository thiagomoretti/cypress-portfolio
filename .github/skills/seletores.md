# 🎯 Skill - Seletores em Cypress

> **Guia Profissional de Estratégia de Seleção de Elementos**

---

## 📌 Objetivo

Estabelecer um padrão obrigatório e consistente para seleção de elementos em testes Cypress, garantindo:
- ✅ Testes **robustos** e **resilientes**
- ✅ **Manutenibilidade** a longo prazo
- ✅ **Independência** de mudanças visuais/CSS
- ✅ **Seletores claros** para Page Objects e manutenção

---

## 🏆 Hierarquia de Seletores Recomendados

### 1️⃣ `data-testid` (Prioridade Máxima)

```html
<button data-testid="btn-login">Login</button>
```

```javascript
cy.get('[data-testid="btn-login"]').click()
```

- Ideal para elementos críticos de teste
- Estável frente a mudanças de layout e CSS
- Recomendado para todos os elementos principais

---

### 2️⃣ `aria-label` (Segunda Opção)

```html
<button aria-label="Fechar modal">✕</button>
```

```javascript
cy.get('[aria-label="Fechar modal"]').click()
```

- Bom para ícones e elementos sem texto
- Mantém acessibilidade e testabilidade

---

### 3️⃣ `id` (Terceiro Recurso)

```html
<input id="email" type="email" />
```

```javascript
cy.get('#email').type('usuario@teste.com')
```

- Único no DOM, mas pode ser usado também para CSS/JS
- Use apenas quando `data-testid` não estiver disponível

---

### 4️⃣ `name` (Formulários)

```html
<input name="senha" type="password" />
```

```javascript
cy.get('input[name="senha"]').type('Senha@123')
```

- Bom para campos de formulário com `name` descritivo
- Use como opção quando id/data-testid não estiver disponível

---

### 5️⃣ Texto visível (Último Recurso)

```javascript
cy.contains('button', 'Enviar').click()
```

- Frágil para mudanças de idioma e texto
- Use somente quando não houver alternativa melhor

---

## 🚫 Antipadrões de Seleção

- `cy.get('.btn')` → classes genéricas
- `cy.get('input:nth-child(3)')` → dependência de estrutura
- `cy.get('[id^="item-"]')` → IDs dinâmicos
- `cy.get('.modal .content > button')` → seletores muito profundos
- XPath via plugin → prefira seletores CSS ou Test IDs

---

## 🚀 Seletores para Elementos Dinâmicos

### Preferência:
1. `data-testid`
2. `aria-label`
3. seletor relativo com `cy.contains`

### Exemplo

```html
<div data-testid="product-card-123">
  <button data-testid="btn-add-cart">Adicionar</button>
</div>
```

```javascript
cy.get('[data-testid="product-card-123"]')
  .find('[data-testid="btn-add-cart"]')
  .click()
```

---

## 🏗️ Uso em Page Objects

```javascript
class LoginPage {
  seletores = {
    inputEmail: '[data-testid="input-email"]',
    inputSenha: '[data-testid="input-password"]',
    botaoEntrar: '[data-testid="btn-login"]',
    mensagemErro: '[data-testid="msg-error"]'
  }

  preencherEmail(email) {
    cy.get(this.seletores.inputEmail).type(email)
  }

  preencherSenha(senha) {
    cy.get(this.seletores.inputSenha).type(senha)
  }

  clicarEntrar() {
    cy.get(this.seletores.botaoEntrar).click()
  }
}

export default new LoginPage()
```

---

## 📋 Checklist de Revisão de Seletores

- [ ] Usa `data-testid` sempre que possível
- [ ] Não usa classes genéricas
- [ ] Não depende de posição (`:nth-child`)
- [ ] Evita `id` dinâmicos
- [ ] Usa `aria-label` quando necessário
- [ ] Seletores estão claros e legíveis
- [ ] Page Objects armazenam seletores, não lógica de UI

---

## 📞 Dicas para Solicitar `data-testid` ao Dev

```markdown
Por favor, adicione `data-testid="btn-add-to-cart"` ao botão "Adicionar ao Carrinho".
```

- Torna testes mais estáveis
- Não altera o comportamento da página
- Ajuda QA e desenvolvimento a padronizar seletores

---

**Skill Criada Por:** QA Lead  
**Obrigatoriedade:** ⚠️ **OBRIGATÓRIA**  
**Revisor:** Tech Lead QA  

✅ **Status:** Ativa e Vinculante
