# Codex of the Diamond Flame

This repo packages the Codex experience (frontend + tRPC backend) together with the Synthsara source libraries so you can browse, prototype, and remix the myth-tech stack locally.

## What's inside
- `client/` React 19 SPA (Vite) with routes:
  - `/` Codex dashboard shell
  - `/codex` Synthsara Codex Core reader (scrolls, prompts, diagrams)
  - `/synthsara-org` Synthsara.org source library (UI modules, contracts, UDS protocol)
  - `/profile` member profile
- `server/` Express + tRPC entry (`server/_core/index.ts`), Stripe hooks, LLM bridge, auth.
- `shared/` cross-app constants and Codex metadata.
- `synthsara-codex-core/` vendored Codex texts, prompts, patterns, quests, diagrams.
- `synthsara-org/` vendored Synthsara.org bundle (TSX flows, Solidity contracts, UDS/Rosetta protocols).

## Static mounts
- `/codex-core/*` serves raw Synthsara Codex Core assets from `synthsara-codex-core/`.
- `/synthsara-org/*` serves raw Synthsara.org assets from `synthsara-org/`.

## API surface (tRPC)
- `codex.list` / `codex.get` — index + fetch Codex Core docs.
- `synthsaraOrg.list` / `synthsaraOrg.get` — index + fetch Synthsara.org docs.
- Auth, user prefs, Stripe, Sarah chat, scroll unlocks (see `server/routers.ts`).

## Run it
1) Install: `corepack pnpm install`
2) Dev: `pnpm dev` (or PowerShell: `$env:NODE_ENV='development'; pnpm dev`)
3) Build: `pnpm build`
4) Type check: `pnpm check`

## Notes
- LLM calls require `OPENAI_API_KEY` (see `server/_core/llm.ts`).
- Stripe flows require `STRIPE_SECRET_KEY` and product config (`server/stripe/products.ts`).
- MySQL connection comes from `DATABASE_URL`; use `pnpm seed:dev` to seed test users/scrolls.
