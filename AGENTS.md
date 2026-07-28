# Instructios for agents

## Libraries

- Use `oxfmt` for formatting
- Use `tRPC` for client-server interactions
- Wrap `fetch`-requests to foreign services into neverthrow's `Result` to improve durabilty

## Scripts

Add helper scripts to `justfile`, not `package.json`

## Check yourself

- `just typecheck` - for typechecking
- `just fmt` - for formatting
- Make sure that file `vite.config.js` does not exist. You already have `vite.config.ts`.

## Code style

- variables of types `Result` and `ResultAsync` from "neverthrow" should start with `$` (for example: `const $donations = ResultAsync.fromPromise(...)`)
