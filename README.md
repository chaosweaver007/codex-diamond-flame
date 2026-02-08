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

## Deploy to Vercel
This application is configured to deploy to Vercel with zero configuration:

1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the configuration in `vercel.json`
3. The build process will:
   - Run `pnpm install` to install dependencies
   - Run `pnpm build` to build both client and server
   - Deploy the Express app as a serverless function
4. Set environment variables in Vercel dashboard:
   - `DATABASE_URL` - MySQL connection string
   - `OPENAI_API_KEY` - For LLM calls
   - `STRIPE_SECRET_KEY` - For Stripe integration
   - `OAUTH_SERVER_URL` - OAuth server URL
   - Other required environment variables

The application will automatically detect the Vercel environment and serve the built static files from `dist/public/`.

## Notes
- LLM calls require `OPENAI_API_KEY` (see `server/_core/llm.ts`).
- Stripe flows require `STRIPE_SECRET_KEY` and product config (`server/stripe/products.ts`).
- MySQL connection comes from `DATABASE_URL`; use `pnpm seed:dev` to seed test users/scrolls.
