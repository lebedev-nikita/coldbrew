# Omnistream

This app is created for streamers. It connects to many donation platforms (such as donationalerts.com), fetches donates from all of them and displays them all in one place.

## Libraries

- Use `oxfmt` for formatting
- Use `tRPC` for client-server interactions
- Wrap `fetch`-requests to foreign services into neverthrow's `Result` to improve durabilty
- Use `shadcn` for UI components
- Use `tailwindcss` for styling

## Scripts

Add helper scripts to `justfile`, not `package.json`

## Check yourself

- `just typecheck` - for typechecking
- `just fmt` - for formatting
- Make sure that file `vite.config.js` does not exist. You already have `vite.config.ts`.

## Code style

- variables of types `Result` and `ResultAsync` from "neverthrow" should start with `$` (for example: `const $donations = ResultAsync.fromPromise(...)`)
