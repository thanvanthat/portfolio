# Agent notes

This is a Next.js (App Router) project. Version-matched Next.js docs are bundled at
`node_modules/next/dist/docs/` — prefer them over memory.

- Portfolio content lives in `/data` (typed in `/lib/types.ts`). Presentation components never hardcode project facts.
- Run `npm run lint`, `npm run typecheck` and `npm run build` before pushing.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
