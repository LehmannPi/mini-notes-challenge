# Mini‑Notes Frontend (React + Vite + Tailwind v4 + shadcn/ui)

Interface de notas em página única (SPA) com quadro de post-its e abas com ações de CRUD.

## Recursos

- Visual de quadro (Board) com cartões estilo post-it
- Abas para ações de CRUD: Criar, Atualizar e Remover
- Atualização otimista básica e feedback de erro
- Componentes shadcn/ui: `button`, `card`, `tabs`, `input`, `label`, `textarea`, `select`, `separator`, `alert-dialog`
- Tailwind v4 via plugin oficial `@tailwindcss/vite`
- Proxy do Vite para a API: requisições para `/api/*` são redirecionadas para `http://127.0.0.1:3001`
- Cliente HTTP simples em `src/lib/api.ts`
- Logo animado (FlowerLogo) com animações CSS em `src/index.css`
- Fundo com ruído sutil aplicado ao board

## Pré‑requisitos

- Node.js 20+
- Bun
- API rodando em `http://127.0.0.1:3001` (ou ajuste o proxy no `vite.config.ts`)

## Como rodar

```sh
# dentro de web/
bun install
bun run dev             # abre Vite em http://localhost:5173

# build e preview
bun run build
bun run preview
```

Se a API estiver em outra URL/porta, ajuste o `server.proxy` em `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:3001',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, ''),
    },
  },
}
```

## Estrutura relevante

```
web/
  src/
    components/
      FlowerLogo.tsx         # SVG animado (pétalas com stagger)
      ui/                    # componentes shadcn/ui
    lib/
      api.ts                 # cliente HTTP
      utils.ts
    App.tsx                  # SPA: Board + Abas de CRUD
    index.css                # Tailwind v4 + tokens + animações
  vite.config.ts             # plugin React + Tailwind e proxy /api
```

## Personalização de tema

Os tokens de cor base e variáveis estão em `src/index.css`. Você poderá aplicar presets e ajustes com TweakCN: `https://tweakcn.com/`.

## Acessibilidade

- Contraste e foco visível utilizando tokens do tema e utilitários do Tailwind
- Navegação por teclado nos formulários e botões padrão dos componentes

## Prompts de IA utilizados

- "I want to build a front end in the @web/ folder to accompany the @api/ folder. It can be done in a single page since it's based on a simple CRUD, the cards for the listing should be displayed like post-its in a board. The page can be divided in two parts: the board (view of the notes) and a tab view, which can alternate between the functions of the CRUD - Which are get by create, update, and delete. Use Shadcn components - I'll provide the custom styling with tweakcn (@https://tweakcn.com/ ) settings later"
- "I have this css of an animation logo I wish to use. Please create a component for it and place it beside the title: (Inseri o html que fiz com a logo + animação)"
- "Good progress but the flower is disappearing after it animates I want it to be always visible after animating."
