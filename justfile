[default]
default:
  @just --list

install:
  pnpm install

dev-server:
  cd apps/server         && pnpm exec dotenvx run -f ../../.env -- pnpm exec tsx --watch src/index.ts

dev-donationalerts:
  cd apps/donationalerts && pnpm exec dotenvx run -f ../../.env -- pnpm exec tsx --watch src/index.ts

dev-client:
  cd apps/client && pnpm exec vite

dev:
  pnpm exec concurrently -n 'client,server,donationalerts' 'just dev-client' 'just dev-server' 'just dev-donationalerts'

typecheck-client:
  cd apps/client && pnpm exec tsc --noEmit

typecheck-server:
  cd apps/server && pnpm exec tsc --noEmit

typecheck-donationalerts:
  cd apps/donationalerts && pnpm exec tsc --noEmit

typecheck-packages:
  cd packages && pnpm exec tsc --noEmit

typecheck: typecheck-client typecheck-server typecheck-donationalerts typecheck-packages


fmt:
  pnpm exec oxfmt

fmt-check:
  pnpm exec oxfmt --check


build-client: install
  cd client && pnpm exec vite build && pnpm exec tsc

test-client: install
  cd apps/client && pnpm exec vitest --run --passWithNoTests

test-server: install
  cd apps/server && pnpm exec vitest --run --passWithNoTests

test-donationalerts: install
  cd apps/donationalerts && pnpm exec vitest --run --passWithNoTests

test-packages: install
  cd packages && pnpm exec vitest --run --passWithNoTests

test: test-server test-donationalerts test-packages test-client

lint: test fmt-check


schema-apply:
  pgschema apply --file db/schema.sql

count-lines path=".":
  find "{{path}}" -type d -name "node_modules" -prune -o -type f \( -name "*.ts" -o -name "*.tsx" \) -print0 | xargs -0 wc -l
