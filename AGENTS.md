# Instructios for agents

## Libraries

- Use `oxfmt` for formatting
- Prefer using `@trpc/tanstack-react-query` over `@trpc/react-query`

## Scripts

Add helper scripts to `justfile`, not `package.json`

## Check yourself

- `just typecheck` - for typechecking
- `just fmt` - for formatting
- Make sure that file `vite.config.js` does not exist. You already have `vite.config.ts`.
