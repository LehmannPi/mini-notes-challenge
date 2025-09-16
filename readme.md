# README — Mini Notes App (Effect + React + Drizzle)

## 🎯 Objetivo

Construir um aplicativo web simples de **notas** que permita criar, listar, atualizar e excluir registros.
O desafio avalia sua capacidade de trabalhar com nosso stack principal (**Effect, React, Drizzle**) e explorar o uso de IA no design de interface.

---

## 🔧 Requisitos Técnicos

### Backend

- Desenvolver em **TypeScript** usando **Effect**:

  - `http-api` para definição de contrato e rotas
  - uso de **services** e **layers** para injeção de dependências
  - validação com **schemas**
  - erros tipados mapeados corretamente para status HTTP

- CRUD completo de notas: criar, listar, buscar por ID, atualizar e excluir.

### Banco de Dados

- Modelagem via **Drizzle ORM** (SQLite ou Postgres).
- Tabela `notes` com:

  - `id`, `title`, `content`, `createdAt`, `updatedAt`.

### Frontend

- Interface em **React**.
- CRUD acessível e fluido.
- Estilo/UX produzido com apoio de **IA** (Cursor, Claude Code, etc.).
- Uso consistente da **paleta Ledda**:

  **Primary Colors**

  - Primary: Deep teal `#1E4D4A` / `hsl(180, 45%, 15%)`
  - Secondary: Light green `#D5E5DC` / `hsl(142, 25%, 86%)`

  **Supporting Colors**

  - Background: Pure white `hsl(0, 0%, 100%)`
  - Foreground: Deep teal `hsl(180, 45%, 15%)`
  - Muted: Very light green `hsl(142, 25%, 96%)`
  - Accent: Light green `hsl(142, 25%, 86%)`
  - Border: Light green `hsl(142, 25%, 86%)`

  **Logo Colors**

  - Petals: Light green `#C1D9C3`
  - Stroke: White

### Documentação

- **README** deve explicar:

  - Como rodar localmente (backend, frontend, banco).
  - Decisões técnicas e trade-offs.
  - Como a IA foi utilizada no design (com prompts ou descrição do processo).

---

## 📂 Estrutura Sugerida

```
/apps
  /api
    src/
      domain/        # schemas, erros de domínio
      services/      # services + layers
      http/          # contrato HttpApi + handlers
      db/            # schema Drizzle + migrations
  /web
    src/
      components/    # UI (cards, forms, feedback)
      pages/         # telas de CRUD
      lib/           # client API
      styles/        # tokens e temas
```

---

## 📑 Critérios de Avaliação

| Critério                                                            | Peso |
| ------------------------------------------------------------------- | ---: |
| Uso do Effect (services, layers, http-api, erros tipados)           |  25% |
| **Acessibilidade** (contraste, foco visível, navegação por teclado) |  15% |
| Modelagem de dados e Drizzle                                        |  10% |
| Frontend/UX                                                         |  20% |
| Uso de IA no design                                                 |  10% |
| Qualidade de código (organização, tipagem, testes básicos)          |  10% |
| Developer Experience (setup simples, README, env)                   |  10% |

**Bônus (+ até 10%)**

- TanStack Query e gerenciamento de cache
- Testes e2e (Playwright)
- Deploy funcional (Vercel/Render/Railway)
