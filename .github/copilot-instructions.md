# Copilot Instructions (Codex of the Diamond Flame)

## Repo Map (where to change things)
- `client/` React 19 SPA (routing via `wouter`; app shell in `client/src/App.tsx`).
- `server/_core/index.ts` is the **dev/build entry** (`pnpm dev` + `pnpm build` bundle this).
- `server/routers.ts` is the single tRPC `appRouter` (add new API procedures here).
- `drizzle/schema.ts` defines MySQL tables + inferred types; `shared/types.ts` re-exports schema types.
- `shared/` holds constants + shared errors used by both client and server.

## Day-to-day Commands
- `pnpm dev` (starts tsx watch server). On Windows PowerShell, env vars in scripts may not apply; prefer running via Git Bash/WSL **or** `\$env:NODE_ENV='development'; pnpm dev`.
- `pnpm build` (Vite client build → `dist/public`, then esbuild server bundle → `dist/`).
- `pnpm test` (Vitest, Node env) and `pnpm check` (TypeScript).
- `pnpm db:push` (Drizzle generate+migrate). Requires `DATABASE_URL`.

## API + Auth Rules (tRPC)
- Client tRPC is configured in `client/src/main.tsx` using `httpBatchLink({ url: '/api/trpc', transformer: superjson, credentials: 'include' })`.
- Define procedures using `publicProcedure` / `protectedProcedure` / `adminProcedure` from `server/_core/trpc.ts`.
- For auth failures, throw `new TRPCError({ code: 'UNAUTHORIZED', message: UNAUTHED_ERR_MSG })`; the client redirects to login when the message matches `UNAUTHED_ERR_MSG`.
- Auth context is created in `server/_core/context.ts` via `sdk.authenticateRequest(req)` (cookie session; `COOKIE_NAME` lives in `shared/const.ts`).

## Database + Stripe Conventions
- Always access MySQL via `await getDb()` from `server/db.ts`; handle the “db unavailable” case like existing procedures in `server/routers.ts`.
- Products/tier definitions live in `server/stripe/products.ts`; Stripe webhooks are handled in `server/stripe/webhook.ts`.
- Purchases are stored minimally in DB (see `drizzle/schema.ts` `purchases`); fetch full details from Stripe when needed.

## Imports / Aliases
- Use `@/` for `client/src/*`, `@shared/*` for `shared/*`, and `@assets/*` for `attached_assets/*` (see `vite.config.ts` + `tsconfig.json`).
