# Omnistream

PNPM TypeScript monorepo with a Hono/tRPC/Postgres API and a React client using TanStack Router and Query. The server runs directly from TypeScript through `tsx`; it has no compiled production build artifact.

Project tasks are managed with [just](https://just.systems/). Run `just` to list them.

## Start locally

```sh
cp .env.example .env
just install
just dev
```

Before starting the app, install and start PostgreSQL locally, then create the
database named in `DATABASE_URL` (by default, `omnistream`). The client runs at
`http://localhost:5173`; the API runs at `http://localhost:3000`.
