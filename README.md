# aegis

Landing page for **Aegis**, a wearable Peltier wristband for adaptive
thermal-comfort bursts. Concept stage. No hardware yet.

This commit lays down the build scaffold. The actual page implementation
lands in the next commit.

## Stack

Astro 5 · Tailwind v4 (`@theme inline`) · Motion · pnpm · Cloudflare Pages

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output to dist/
pnpm preview      # serve dist/
```

See `CLAUDE.md` for design rules and project context.
