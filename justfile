set dotenv-load
set dotenv-required
set dotenv-path := "apps/server/.env"

[default]
default:
  @just --list

install:
  pnpm install

dev-server:
  cd apps/server && pnpm tsx --watch src/index.ts

dev-client:
  cd apps/client && pnpm vite

dev:
  pnpx concurrently@10 -n 'client,server' 'just dev-client' 'just dev-server'

typecheck-client:
  cd apps/client && pnpm tsc --noEmit

typecheck-server:
  cd apps/server && pnpm tsc --noEmit

typecheck: typecheck-client typecheck-server


fmt-sql:
  # pg_format -i ./db/*.sql

fmt-js:
  pnpm fmt

fmt: fmt-sql fmt-js

fmt-check:
  pnpm fmt:check


build-client: install
  cd client && pnpm vite build && pnpm tsc

test-client: install
  cd apps/client && pnpm vitest --run --passWithNoTests

test-server: install
  cd apps/server && pnpm vitest --run --passWithNoTests

test: test-server test-client


lint: test fmt-check


schema-apply:
  pgschema apply --file db/schema.sql
