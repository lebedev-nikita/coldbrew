set dotenv-load

[default]
default:
  @just --list

install:
  pnpm install

dev-server:
  pnpm --filter @omnistream/server dev

dev-client:
  pnpm --filter @omnistream/client dev

dev:
  pnpx concurrently@10 -n 'client,server' 'just client-dev' 'just server-dev'

typecheck:
  pnpm -r typecheck

fmt:
  pnpm fmt

fmt-check:
  pnpm fmt:check

build:
  pnpm -r build

test-client:
  cd apps/client && pnpm vitest --run

test-server:
  cd apps/server && pnpm vitest --run

test: test-server test-client