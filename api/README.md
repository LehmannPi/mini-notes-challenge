# Mini‑Notes API

API HTTP construída com Effect + @effect/platform e Drizzle ORM (Postgres).

## O que são migrações neste projeto?

Migrações são arquivos versionados (em `drizzle/`) que descrevem mudanças de esquema do banco (ex.: criar tabela `notes`). Elas garantem que o banco de todos os ambientes esteja no mesmo estado. Você pode:

- Gerar/migrar via Drizzle Kit (comandos `db:generate`/`db:migrate`), ou
- Usar a flag `MIGRATE_ON_STARTUP=true` para migrar automaticamente ao iniciar a API.

## Requisitos

- Node.js 20+ (22 recomendado)
- Bun (recomendado para rodar scripts)
- PostgreSQL 14+ (local via Docker) ou Neon (Postgres serverless)

## Configuração do ambiente (.env)

Crie `api/.env` com, por exemplo (Postgres local):

```env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/notes
PORT=3001
HOST=127.0.0.1
# Opcional: migrar ao iniciar
MIGRATE_ON_STARTUP=true
```

Usando Neon (recomendado para cloud/serverless), defina `DATABASE_URL` com a URL do Neon. Guia oficial Drizzle + Neon: [Get Started with Drizzle and Neon](https://orm.drizzle.team/docs/get-started/neon-new)

## Banco local (Docker) – opcional

```sh
docker run --name notes-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=notes \
  -p 5432:5432 -d postgres:16
```

## Instalação

```sh
# dentro de api/
bun install
```

## Migrações

```sh
bun run db:migrate        # aplica migrações
bun run db:studio         # (opcional) abre Drizzle Studio
```

## Seed (dados iniciais)

```sh
bun run db:seed
# O script insere notas de exemplo se a tabela estiver vazia
```

## Rodando em desenvolvimento

```sh
bun run dev
# endereço exibido no log, ex: http://127.0.0.1:3001
```

## Endpoints

- GET `/` → `{ message: "Welcome to Mini-Notes API. Use /notes" }`
- GET `/notes` → lista notas
- GET `/notes/:id` → nota por id
- POST `/notes` → cria nota
  - body: `{ "title": string, "content": string }`
- PUT `/notes/:id` → atualiza título/conteúdo
  - body: `{ "title"?: string, "content"?: string }`
- DELETE `/notes/:id` → remove nota

### Exemplos com curl

```sh
curl http://127.0.0.1:3001/

curl http://127.0.0.1:3001/notes

curl -X POST http://127.0.0.1:3001/notes \
  -H "Content-Type: application/json" \
  -d '{"title":"Minha nota","content":"Conteúdo"}'

curl -X PUT http://127.0.0.1:3001/notes/1 \
  -H "Content-Type: application/json" \
  -d '{"title":"Atualizado"}'

curl -X DELETE http://127.0.0.1:3001/notes/1
```

## Build de produção

```sh
bun run build
bun run start
```

## Deploy (ex.: Render)

- Use `HOST=0.0.0.0` e respeite a env `PORT` fornecida pela plataforma
- A URL pública é gerenciada pelo provedor (ex.: `https://<servico>.onrender.com`)

## Dicas & Troubleshooting

- ECONNREFUSED ao iniciar/seed: verifique se o Postgres está rodando e se `DATABASE_URL` está correto (local ou Neon)
- Log mostra `http://::1:3001`: defina `HOST=127.0.0.1` para preferir IPv4
- 404 em PUT/DELETE: provavelmente o id não existe
- Frontend em outra origem: adicione CORS no pipeline (`HttpApiBuilder.middlewareCors({ allowedOrigins: ['http://localhost:5173'] })`)
