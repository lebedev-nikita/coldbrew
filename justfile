set dotenv-load
set dotenv-required
set dotenv-path := "apps/backend/.env"

[default]
default:
  @just --list

install:
  pnpm install

dev-backend:
  cd apps/backend && pnpm exec tsx --watch src/index.ts

dev-client:
  cd apps/client && pnpm exec vite

dev:
  pnpm exec concurrently -n 'client,backend' 'just dev-client' 'just dev-backend'

typecheck-client:
  cd apps/client && pnpm exec tsc --noEmit

typecheck-backend:
  cd apps/backend && pnpm exec tsc --noEmit

typecheck: typecheck-client typecheck-backend


fmt:
  pnpm exec oxfmt

fmt-check:
  pnpm exec oxfmt --check


build-client: install
  cd client && pnpm exec vite build && pnpm exec tsc

test-client: install
  cd apps/client && pnpm exec vitest --run --passWithNoTests

test-backend: install
  cd apps/backend && pnpm exec vitest --run --passWithNoTests

test: test-backend test-client


lint: test fmt-check


schema-apply:
  pgschema apply --file db/schema.sql
