# 📊 Skill - Fixture (Massa de Dados)

> **Guia Profissional de Gerenciamento de Dados de Teste em Cypress**

---

## 📌 Objetivo

Estabelecer um padrão obrigatório para gerenciamento de dados de teste (fixtures) em Cypress, garantindo:
- ✅ **Reutilização** de dados entre testes
- ✅ **Manutenção** centralizada e fácil
- ✅ **Escalabilidade** conforme projeto cresce
- ✅ **Zero** hardcoding de valores no código
- ✅ **Organização** lógica por domínio

---

## 🚀 Quando Usar Esta Skill

Use esta skill quando:

| Situação | Ação |
|----------|------|
| Criando novo teste | ✅ Criar/Usar fixture apropriada |
| Adicionando dados de teste | ✅ Adicionar à fixture, não ao teste |
| Refatorando testes existentes | ✅ Extrair dados para fixtures |
| Múltiplos testes usam mesmos dados | ✅ Centralizar em fixture |
| Dados precisam ser atualizados | ✅ Atualizar fixture, não 10 testes |
| Novo domínio/feature | ✅ Criar nova pasta de fixtures |

---

## 🏆 Fixture vs API: Quando Usar Qual?

### ✅ Use Fixture Quando:

| Caso | Exemplo | Reasoning |
|------|---------|-----------|
| Dados **estáticos** | Usuário padrão para login | Não muda entre testes |
| Dados de **múltiplos testes** | Livro para adicionar ao carrinho | Reutilização |
| **Setup rápido** é crítico | Antes de cada teste E2E | Melhor performance |
| Testar **lógica da UI** | Validar exibição de dados | Não precisa backend |
| Proteger **dados sensíveis** | Não expor dados reais | Segurança |
| **Testes em CI/CD** | Pipeline sem acesso a BD | Reprodutibilidade |

```javascript
// ✅ BOM - Usar Fixture
import usuario from '../fixtures/usuario.json'

beforeEach(() => {
  cy.login(usuario.admin.email, usuario.admin.senha)
})
```

### 🔴 Use API Quando:

| Caso | Exemplo | Reasoning |
|------|---------|-----------|
| Dados **dinâmicos** | ID retornado pelo servidor | Muda a cada requisição |
| Testar **criação de dados** | Cadastro de novo usuário | Precisa persistir |
| Testar **fluxos completos** | Login → Criar conta → Checkout | End-to-end real |
| **Validar integração** com backend | Dados salvam corretamente | Testar comunicação |
| Dados precisam ser **únicos** | Email único para cadastro | Evitar duplicatas |

```javascript
// 🔴 BOM - Usar API
cy.cadastroViaAPI(nome, email, telefone, senha)
  .then((response) => {
    expect(response.status).to.eq(201)
    expect(response.body.id).to.exist
  })
```

### 🎯 Estratégia Híbrida (Recomendada)

```javascript
// Melhor prática: Combinar ambas
beforeEach(() => {
  // Setup rápido com fixtures
  cy.login(usuario.admin.email, usuario.admin.senha)
})

it('Deve criar novo livro e validar', () => {
  // Criar via API (gera ID real)
  cy.cadastroLivroViaAPI({
    titulo: livros.novo.titulo,
    autor: livros.novo.autor,
    preco: livros.novo.preco
  }).then((livroId) => {
    // Validar na UI (usa fixture para dados esperados)
    cy.visit(`/livros/${livroId}`)
    cy.contains(livros.novo.titulo)
      .should('be.visible')
  })
})
```

---

## 📁 Convenção de Nomeação de Fixtures

### Padrão Obrigatório

```
cypress/fixtures/
├── [dominio]/
│   └── [recurso].[tipo].json
└── [recurso].json (se arquivo único)
```

### Exemplos de Nomeação

| Arquivo | Tipo | Uso |
|---------|------|-----|
| `usuario.json` | Usuários gerais | Login, cadastro |
| `livros.json` | Livros | Busca, detalhes |
| `carrinho.json` | Dados do carrinho | Adicionar, remover |
| `auth/admin.json` | Usuário admin | Testes admin |
| `auth/user.json` | Usuário comum | Testes normais |
| `books/validos.json` | Livros válidos | Testes positivos |
| `books/invalidos.json` | Livros inválidos | Testes negativos |
| `api-responses.json` | Respostas mockadas | Intercept |

### ❌ NUNCA Fazer:

```
❌ user1.json
❌ data.json
❌ test-data-users-login-1.json
❌ USUARIO.json (case-sensitive issues)
❌ usuario_admin_v2_backup.json
```

### ✅ Padrão Correto:

```
✅ usuario.json
✅ auth/admin.json
✅ auth/user.json
✅ books.json
✅ cart.json
✅ auth-usuario.json
```

---

## 🎨 Organizar Fixtures por Domínio

### Estrutura Recomendada

```
cypress/fixtures/
│
├── usuario.json                    ← Usuário padrão/genérico
├── livros.json                     ← Livros padrão
├── carrinho.json                   ← Dados do carrinho
│
├── auth/                           ← Domínio: Autenticação
│   ├── admin.json                  ├─ Usuário admin
│   ├── user.json                   ├─ Usuário comum
│   ├── invalid-credentials.json    ├─ Dados inválidos
│   └── locked-account.json         └─ Conta bloqueada
│
├── books/                          ← Domínio: Livros
│   ├── validos.json                ├─ Livros válidos
│   ├── invalidos.json              ├─ Livros inválidos
│   ├── esgotados.json              └─ Livros esgotados
│
├── cart/                           ← Domínio: Carrinho
│   ├── items.json                  ├─ Itens típicos
│   ├── empty.json                  ├─ Carrinho vazio
│   └── full.json                   └─ Carrinho completo
│
├── checkout/                       ← Domínio: Checkout
│   ├── endereco.json               ├─ Endereços
│   ├── pagamento.json              └─ Dados de pagamento
│
└── api-responses/                  ← Respostas mockadas
    ├── livros-list.json            ├─ Lista de livros
    ├── livro-detail.json           ├─ Detalhes livro
    └── erro-500.json               └─ Erro do servidor
```

### Vantagens Dessa Organização

✅ **Escalável:** Fácil adicionar novos domínios  
✅ **Modular:** Mudanças no auth não afetam books  
✅ **Intuitivo:** Novo dev encontra dados rapidamente  
✅ **Manutenível:** Dados relacionados agrupados  
✅ **Testável:** Um domínio por vez  

---

## 📋 Exemplo de Estrutura de Fixture

### ❌ RUIM - Sem Organização

```json
{
  "user": "admin@test.com",
  "pass": "Admin123!",
  "name": "Admin User",
  "book": "Clean Code",
  "author": "Robert Martin",
  "price": 89.90,
  "email2": "user@test.com",
  "pass2": "User123!",
  "book2": "Design Patterns"
}
```

**Problemas:**
- ❌ Mistura domínios
- ❌ Difícil encontrar dados específicos
- ❌ Impossível reutilizar parcialmente
- ❌ Sem estrutura lógica

### ✅ BOM - Organizado

```json
{
  "admin": {
    "email": "admin@test.com",
    "senha": "Admin123!",
    "nome": "Admin User",
    "perfil": "administrator"
  },
  "user": {
    "email": "user@test.com",
    "senha": "User123!",
    "nome": "User Comum",
    "perfil": "user"
  }
}
```

### ⭐⭐⭐ ÓTIMO - Bem Estruturado

```json
{
  "usuarios": {
    "admin": {
      "email": "admin@biblioteca.com",
      "senha": "Admin@123",
      "nome": "Admin User",
      "perfil": "administrador",
      "telefone": "11999999999"
    },
    "user": {
      "email": "usuario@biblioteca.com",
      "senha": "User@123",
      "nome": "User Comum",
      "perfil": "cliente",
      "telefone": "11988888888"
    },
    "invalid": {
      "email": "invalido@",
      "senha": "123",
      "nome": ""
    }
  },
  "validacoes": {
    "senhaForte": "Senha@123",
    "senhaFraca": "12345",
    "emailValido": "test@example.com",
    "emailInvalido": "email-invalido"
  }
}
```

---

## 🚫 Como Evitar Dados Hardcoded

### ❌ NUNCA: Hardcoding nos Testes

```javascript
// ❌ NUNCA FAZER ISTO
it('Deve fazer login com sucesso', () => {
  cy.get('#email').type('admin@teste.com')  // ❌ HARDCODED
  cy.get('#password').type('Senha@123')      // ❌ HARDCODED
  cy.get('#login-btn').click()
  cy.url().should('include', '/dashboard')
})

it('Deve adicionar livro ao carrinho', () => {
  cy.contains('Clean Code')                  // ❌ HARDCODED
    .find('button')
    .click()
  cy.get('#cart-count').should('contain', '1')
})

// ❌ MUITO RUIM - Dados espalhados
const usuarios = [
  { email: 'user1@test.com', senha: 'Pass1!' },
  { email: 'user2@test.com', senha: 'Pass2!' }
]
```

### ✅ SEMPRE: Usar Fixtures

```javascript
// ✅ BOM - Usar fixture
import usuarios from '../fixtures/auth/usuarios.json'

it('Deve fazer login com sucesso', () => {
  cy.get('#email').type(usuarios.admin.email)
  cy.get('#password').type(usuarios.admin.senha)
  cy.get('#login-btn').click()
  cy.url().should('include', '/dashboard')
})

// ✅ BOM - Reutilizar em múltiplos testes
it('Deve fazer logout com sucesso', () => {
  cy.login(usuarios.admin.email, usuarios.admin.senha)
  cy.logout()
  cy.url().should('include', '/login')
})
```

### 🔄 Padrão Completo: Fixture + Commands + Tests

```javascript
// 1️⃣ FIXTURE: cypress/fixtures/auth/usuarios.json
{
  "admin": {
    "email": "admin@biblioteca.com",
    "senha": "Admin@123"
  },
  "user": {
    "email": "usuario@biblioteca.com",
    "senha": "User@123"
  }
}

// 2️⃣ COMMAND: cypress/support/commands.js
Cypress.Commands.add('login', (email, senha) => {
  cy.get('#email').type(email)
  cy.get('#password').type(senha)
  cy.get('#login-btn').click()
})

// 3️⃣ TEST: cypress/e2e/login.cy.js
import usuarios from '../fixtures/auth/usuarios.json'

it('Deve fazer login com admin', () => {
  // NUNCA: cy.login('admin@biblioteca.com', 'Admin@123')
  // SIM:  cy.login(usuarios.admin.email, usuarios.admin.senha)
  cy.login(usuarios.admin.email, usuarios.admin.senha)
  cy.url().should('include', '/dashboard')
})
```

---

## 📖 Exemplos Práticos de Fixtures

### Exemplo 1: Fixture de Autenticação

```json
// cypress/fixtures/auth/usuarios.json
{
  "admin": {
    "id": 1,
    "email": "admin@biblioteca.com",
    "senha": "Admin@123",
    "nome": "Administrador",
    "tipo": "admin",
    "ativo": true
  },
  "user": {
    "id": 2,
    "email": "usuario@biblioteca.com",
    "senha": "User@123",
    "nome": "Usuário Comum",
    "tipo": "user",
    "ativo": true
  },
  "inativo": {
    "id": 3,
    "email": "inativo@biblioteca.com",
    "senha": "Inativo@123",
    "nome": "Usuário Inativo",
    "tipo": "user",
    "ativo": false
  }
}
```

```javascript
// Uso nos testes
import usuarios from '../fixtures/auth/usuarios.json'

describe('Login', () => {
  it('Deve fazer login como admin', () => {
    cy.login(usuarios.admin.email, usuarios.admin.senha)
    cy.url().should('include', '/admin')
  })

  it('Deve fazer login como user', () => {
    cy.login(usuarios.user.email, usuarios.user.senha)
    cy.url().should('include', '/dashboard')
  })

  it('Deve impedir login de usuário inativo', () => {
    cy.login(usuarios.inativo.email, usuarios.inativo.senha)
    cy.contains('Usuário inativo').should('be.visible')
  })
})
```

### Exemplo 2: Fixture de Livros

```json
// cypress/fixtures/books/livros.json
{
  "validos": [
    {
      "id": 1,
      "titulo": "Clean Code",
      "autor": "Robert C. Martin",
      "preco": 89.90,
      "disponibilidade": true,
      "quantidade": 5,
      "categoria": "Programação"
    },
    {
      "id": 2,
      "titulo": "Design Patterns",
      "autor": "Gang of Four",
      "preco": 120.00,
      "disponibilidade": true,
      "quantidade": 3,
      "categoria": "Arquitetura"
    }
  ],
  "invalidos": [
    {
      "titulo": "",
      "autor": "Autor Sem Título",
      "preco": -10
    },
    {
      "titulo": "Livro Sem Autor",
      "autor": "",
      "preco": 0
    }
  ],
  "esgotados": [
    {
      "id": 3,
      "titulo": "JavaScript: The Good Parts",
      "autor": "Douglas Crockford",
      "disponibilidade": false,
      "quantidade": 0,
      "preco": 75.00
    }
  ]
}
```

```javascript
// Uso nos testes
import livros from '../fixtures/books/livros.json'

describe('Gerenciamento de Livros', () => {
  it('Deve exibir livro válido', () => {
    cy.visit('/livros')
    cy.contains(livros.validos[0].titulo).should('be.visible')
    cy.contains(livros.validos[0].preco.toString()).should('be.visible')
  })

  it('Deve impedir cadastro de livro inválido', () => {
    cy.cadastroLivroUI(livros.invalidos[0])
    cy.contains('Título é obrigatório').should('be.visible')
  })

  it('Deve marcar livro esgotado como indisponível', () => {
    cy.visit(`/livros/${livros.esgotados[0].id}`)
    cy.contains('Indisponível').should('be.visible')
    cy.get('[data-testid="btn-add-cart"]').should('be.disabled')
  })
})
```

### Exemplo 3: Fixture de Carrinho

```json
// cypress/fixtures/cart/items.json
{
  "itemSimples": {
    "livroId": 1,
    "quantidade": 1,
    "preco": 89.90,
    "titulo": "Clean Code"
  },
  "multiplosItens": [
    {
      "livroId": 1,
      "quantidade": 1,
      "preco": 89.90
    },
    {
      "livroId": 2,
      "quantidade": 2,
      "preco": 120.00
    }
  ],
  "validacoes": {
    "cartVazio": {
      "mensagem": "Carrinho vazio",
      "totalItens": 0,
      "total": 0
    },
    "cartComItens": {
      "totalItens": 3,
      "total": 330.80,
      "imposto": 56.84,
      "frete": 15.00
    }
  }
}
```

```javascript
// Uso nos testes
import cartItems from '../fixtures/cart/items.json'

describe('Carrinho de Compras', () => {
  it('Deve adicionar um livro ao carrinho', () => {
    cy.addToCart(cartItems.itemSimples.livroId)
    cy.get('[data-testid="badge-cart"]')
      .should('contain', cartItems.itemSimples.quantidade)
  })

  it('Deve validar total do carrinho com múltiplos itens', () => {
    cartItems.multiplosItens.forEach(item => {
      cy.addToCart(item.livroId, item.quantidade)
    })
    cy.openCart()
    cy.get('[data-testid="total"]')
      .should('contain', cartItems.validacoes.cartComItens.total)
  })
})
```

### Exemplo 4: Fixture de Dados Inválidos (Testes Negativos)

```json
// cypress/fixtures/validation/invalid-data.json
{
  "emails": {
    "vazio": "",
    "semarroba": "emailsemarroba.com",
    "incompleto": "email@",
    "espacos": "email @test.com"
  },
  "senhas": {
    "vazia": "",
    "fraca": "123",
    "semEspecial": "Senha123",
    "semNumero": "Senha@abc",
    "semMaiuscula": "senha@123"
  },
  "nomes": {
    "vazio": "",
    "umCaractere": "A",
    "muitoLongo": "A".repeat(256),
    "comNumeros": "Nome123"
  }
}
```

```javascript
// Uso nos testes
import invalidData from '../fixtures/validation/invalid-data.json'

describe('Validações de Entrada', () => {
  it('Deve rejeitar emails inválidos', () => {
    Object.entries(invalidData.emails).forEach(([tipo, email]) => {
      cy.get('#email').clear().type(email)
      cy.get('#submit').click()
      cy.contains('Email inválido').should('be.visible')
    })
  })

  it('Deve rejeitar senhas fracas', () => {
    const senhaFraca = invalidData.senhas.fraca
    cy.get('#password').type(senhaFraca)
    cy.contains('Senha muito fraca').should('be.visible')
  })
})
```

---

## 🔧 Boas Práticas de Manutenção

### 1️⃣ Versionar Dados de Teste

```json
// cypress/fixtures/auth/usuarios.json
{
  "_metadata": {
    "version": "1.0",
    "lastUpdate": "2026-05-24",
    "author": "QA Team",
    "notes": "Usuários padrão para testes de autenticação"
  },
  "usuarios": {
    // dados aqui
  }
}
```

### 2️⃣ Separar Dados Positivos e Negativos

```
cypress/fixtures/books/
├── validos.json      ← Dados que funcionam
├── invalidos.json    ← Dados que geram erro
└── edge-cases.json   ← Casos extremos
```

### 3️⃣ Comentários em Fixtures Complexas

```json
{
  "usuarios": {
    "admin": {
      "email": "admin@biblioteca.com",
      "senha": "Admin@123",
      "notas": "Usuário admin para testes de acesso restrito. Não alterar sem consultar QA Lead"
    }
  }
}
```

### 4️⃣ Atualizações Centralizadas

```javascript
// ✅ BOM - Atualizar em um lugar
// cypress/fixtures/auth/usuarios.json atualizado
// TODOS os testes usam dados novos automaticamente

// ❌ RUIM - Atualizar em múltiplos lugares
// Mudar email em:
// - login.cy.js
// - cadastro.cy.js
// - perfil.cy.js
// - checkout.cy.js
```

### 5️⃣ Documentar Dados Sensíveis

```markdown
# SENSÍVEL: Dados de Teste

Esses dados são usados apenas para testes:
- ✅ admin@biblioteca.com / Admin@123
- ✅ usuario@biblioteca.com / User@123

⚠️ NÃO use dados reais de produção
⚠️ NÃO use dados pessoais verdadeiros
⚠️ NÃO commitar dados sensíveis

Se precisar testar com dados reais:
1. Use ambiente de teste/staging
2. Crie dados anônimos/fake
3. Nunca coloque no repositório
```

---

## 📊 Checklist de Boas Práticas

```markdown
## Checklist - Fixtures

### Ao Criar Nova Fixture:
- [ ] Nomeada em kebab-case?
- [ ] Organizada em pasta por domínio?
- [ ] Sem dados hardcoded nos testes?
- [ ] Estrutura JSON bem indentada?
- [ ] Comentários/notas inclusos?
- [ ] Metadados de versão adicionados?
- [ ] Dados válidos E inválidos separados?

### Ao Usar Fixture em Teste:
- [ ] Importada no topo do arquivo?
- [ ] Usando a propriedade correta?
- [ ] Teste não modifica fixture?
- [ ] Fixture é a source of truth?
- [ ] Nomeação clara: `usuarios.admin.email`?

### Ao Atualizar Fixture:
- [ ] Versão atualizada?
- [ ] Data de atualização registrada?
- [ ] Todos os testes ainda passam?
- [ ] Mudanças documentadas?
- [ ] Comunicado ao time?

### Ao Revisar PR:
- [ ] Dados estão em fixtures?
- [ ] Nenhum hardcoding no teste?
- [ ] Estrutura segue padrão?
- [ ] Nomes são descritivos?
```

---

## 🚨 Troubleshooting Comum

### Problema 1: "Fixture not found"

```javascript
// ❌ ERRADO
import usuarios from '../usuarios.json'

// ✅ CORRETO
import usuarios from '../fixtures/auth/usuarios.json'
```

### Problema 2: Dados Ficam Obsoletos

```javascript
// ❌ RUIM - Atualiza teste, não fixture
it('Login com novo email', () => {
  cy.login('novo@email.com', 'senha123')  // Quando trocar email?
})

// ✅ BOM - Atualiza fixture
// cypress/fixtures/auth/usuarios.json → email atualizado
// Todos os testes usam novo email automaticamente
```

### Problema 3: Fixture Muito Grande

```javascript
// ❌ RUIM - Uma fixture gigante
cypress/fixtures/
└── tudo.json (1000+ linhas)

// ✅ BOM - Múltiplas fixtures pequenas
cypress/fixtures/
├── auth/
│   ├── usuarios.json
│   ├── permissoes.json
│   └── roles.json
├── books/
│   ├── validos.json
│   └── invalidos.json
└── cart/
    └── items.json
```

### Problema 4: Dados Sensíveis Expostos

```javascript
// ❌ NUNCA
{
  "producao": {
    "username": "admin_real@empresa.com",
    "password": "Senha123Real!"
  }
}

// ✅ SEMPRE
{
  "teste": {
    "username": "admin@test.com",
    "password": "TestPass123!"
  }
}
```

---

## 🎯 Padrão Completo: Do Zero

### Passo 1: Criar Estrutura de Pastas

```bash
mkdir -p cypress/fixtures/{auth,books,cart,checkout}
```

### Passo 2: Criar Fixtures por Domínio

```bash
# Auth
touch cypress/fixtures/auth/usuarios.json
touch cypress/fixtures/auth/permissoes.json

# Books
touch cypress/fixtures/books/livros.json
touch cypress/fixtures/books/categorias.json

# Cart
touch cypress/fixtures/cart/items.json

# Checkout
touch cypress/fixtures/checkout/endereco.json
touch cypress/fixtures/checkout/pagamento.json
```

### Passo 3: Popular Fixtures com Dados

```json
// cypress/fixtures/auth/usuarios.json
{
  "_metadata": {
    "version": "1.0",
    "lastUpdate": "2026-05-24"
  },
  "admin": { /* dados */ },
  "user": { /* dados */ }
}
```

### Passo 4: Usar em Testes

```javascript
// cypress/e2e/login.cy.js
import usuarios from '../fixtures/auth/usuarios.json'

it('Deve fazer login', () => {
  cy.login(usuarios.admin.email, usuarios.admin.senha)
})
```

---

## 📚 Exemplo Real Completo

### Estrutura Final

```
cypress/
├── fixtures/
│   ├── auth/
│   │   └── usuarios.json
│   └── books/
│       └── livros.json
├── support/
│   └── commands.js
└── e2e/
    └── carrinho-livros.cy.js
```

### Arquivo 1: Fixture Auth

```json
// cypress/fixtures/auth/usuarios.json
{
  "admin": {
    "email": "admin@biblioteca.com",
    "senha": "Admin@123",
    "nome": "Administrador"
  }
}
```

### Arquivo 2: Fixture Books

```json
// cypress/fixtures/books/livros.json
{
  "validos": [
    {
      "titulo": "Clean Code",
      "autor": "Robert C. Martin",
      "preco": 89.90
    }
  ]
}
```

### Arquivo 3: Test Completo

```javascript
// cypress/e2e/carrinho-livros.cy.js
import usuarios from '../fixtures/auth/usuarios.json'
import livros from '../fixtures/books/livros.json'

describe('Carrinho de Livros', () => {
  beforeEach(() => {
    cy.login(usuarios.admin.email, usuarios.admin.senha)
  })

  it('Deve adicionar livro ao carrinho', () => {
    cy.visit('/livros')
    cy.contains(livros.validos[0].titulo).click()
    cy.get('[data-testid="btn-add-cart"]').click()
    cy.contains('Adicionado ao carrinho').should('be.visible')
  })
})
```

---

## 🔐 Segurança em Fixtures

### ✅ SEMPRE

```json
// Dados fake/teste
{
  "email": "test@example.com",
  "senha": "TestPass123!",
  "documento": "12345678900",
  "telefone": "11987654321"
}
```

### ❌ NUNCA

```json
// Dados reais/sensíveis
{
  "email": "joao.silva@empresa.com",
  "senha": "123456",
  "documento": "12345678900",  // CPF real?
  "telefone": "11987654321",   // Tel real?
  "cartao": "4532123456789012" // Cartão?
}
```

### 🚨 Se Precisar de Dados Reais

```bash
# Use .env ou .env.local
DATABASE_URL=postgresql://...
API_TOKEN=xyz123...

# NO .gitignore
.env
.env.local

# Acesse via processo
const apiToken = process.env.API_TOKEN
```

---

## 📝 Versionamento e Changelog

```markdown
# cypress/fixtures/CHANGELOG.md

## [1.0] - 2026-05-24
### Added
- Fixtures iniciais de auth e books
- Estrutura por domínio

## [1.1] - 2026-05-25
### Changed
- Adicionado campo `categoria` em livros.json
- Atualizado preço de Clean Code

### Added
- Novos usuários de teste em auth/usuarios.json
```

---

## 🎓 Recursos Adicionais

### Documentação Oficial
- [Cypress Fixtures](https://docs.cypress.io/api/commands/fixture)
- [Fake Data Generation](https://github.com/faker-js/faker)

### Padrões Relacionados
- **Page Objects** → Skill de Page Objects
- **Seletores** → Skill de Seletores
- **Acessibilidade** → Skill de Acessibilidade

---

## 📞 Contato & Dúvidas

Dúvidas sobre fixtures?

1. **Primeiro:** Releia esta documentação
2. **Segundo:** Consulte exemplos em `cypress/fixtures/`
3. **Terceiro:** Verifique testes em `cypress/e2e/`
4. **Quarto:** Contacte o QA Lead

---

## 📝 Versionamento

| Versão | Data | Mudanças |
|--------|------|----------|
| 1.0 | Maio 2026 | Documentação inicial |
| 1.1 | - | Exemplos avançados (planejado) |
| 1.2 | - | Faker.js integrado (planejado) |

---

**Skill Criada Por:** QA Lead  
**Obrigatoriedade:** ⚠️ **OBRIGATÓRIA**  
**Revisor:** Tech Lead QA  

✅ **Status:** Ativa e Vinculante
