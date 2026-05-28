# aegis

Landing page for **Aegis**, a wearable Peltier wristband for adaptive
thermal-comfort bursts. Concept stage. No hardware yet. The site is
where the build is documented in the open.

```
Astro 5  ·  Tailwind v4 (@theme inline)  ·  pnpm  ·  Cloudflare Pages
```

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:4321
pnpm build        # static output to dist/
pnpm preview      # serve dist/ on http://localhost:4321
```

Requires Node 22+ and pnpm 11. If pnpm is missing, the simplest path on
Windows is `npm install -g pnpm@latest`. CI uses `pnpm/action-setup@v4`.

## What is wired up

| Section            | Component                                  | Hydration |
| ------------------ | ------------------------------------------ | --------- |
| Sticky nav + blur  | `src/components/sections/Nav.astro`        | inline JS |
| Hero               | `src/components/sections/Hero.astro`       | CSS @keyframes, zero JS |
| Physics + diagram  | `src/components/sections/Physics.astro` +<br/>`src/components/sections/PhysicsDiagram.astro` | static |
| How it works       | `src/components/sections/HowItWorks.astro` | static    |
| Specs              | `src/components/sections/Specs.astro`      | static    |
| Roadmap            | `src/components/sections/Roadmap.astro`    | static    |
| Devlog teaser      | `src/components/sections/Devlog.astro`     | static    |
| Newsletter         | `src/components/sections/Newsletter.astro` | inline JS |
| Footer             | `src/components/sections/Footer.astro`     | static    |

Total JS shipped on `/`: 0 KB. The Hero entrance is a CSS sequence
with sibling delays 0/80/160/240 ms and respects
`prefers-reduced-motion`.

The newsletter form is a v0 no-op: on submit it console-logs the email
and shows an inline success state for 4s. Wiring point is commented at
the bottom of `Newsletter.astro` — swap for a `fetch('/api/subscribe', ...)`
call backed by Cloudflare Workers + KV, Resend, or ConvertKit.

## Where the Midjourney media lives

Drop hero exports into `public/media/`:

```
public/media/hero.mp4           # 1080p, H.264, < 5 MB, looping, ~10 s
public/media/hero-poster.webp   # first-frame poster, ~150 KB
```

`Hero.astro` checks for `hero.mp4` at build time with `fs.existsSync`.
If present, it renders the `<video>` element. If absent, it falls back
to a CSS-only thermal-gradient backdrop with a "backdrop · awaiting
capture" label. So the site works at every stage between "no media yet"
and "final cut delivered".

Both files are gitignored. Commit `.gitkeep` only.

## Adding a devlog entry

Filename pattern: `src/content/devlog/YYYY-MM-DD-slug.mdx`. The date
prefix is mandatory; it gives stable sort and is stripped from the
URL. So `2026-06-01-thermal-budget.mdx` lives at `/devlog/thermal-budget`.

Frontmatter (full schema in `src/content.config.ts`):

```mdx
---
title: "Bench prototype, first runs"
date: 2026-08-12
summary: "PWM at 4 kHz. PID coefficients off by a factor of three."
tags: ["pid", "bench"]
draft: false
---

Body in MDX. Code blocks render with Shiki. Drafts show in `pnpm dev`,
hidden in `pnpm build`.
```

Two ways to create one:

1. Open a Claude Code session inside the project and ask: *"new devlog
   entry about bench prototype"*. The `aegis-devlog-new` skill scaffolds
   the file with frontmatter, draft flag on, and section stubs.
2. Hand-edit. Copy an existing entry as the template.

Push to `main`. Cloudflare Pages auto-rebuilds.

## Working in this project

The site is one layer of a multi-layer project workspace:

| Path                 | What lives there                                          |
| -------------------- | --------------------------------------------------------- |
| `src/content/devlog/`| MDX devlog entries (this repo's blog)                     |
| `decisions/`         | MADR Architecture Decision Records, numbered 0001+        |
| `milestones.md`      | Canonical project roadmap (mirrored in `Roadmap.astro`)   |
| `bom/components.csv` | Hand-edited bill of materials with placeholder costs      |
| `sim/`               | Stdlib Python simulations (`python sim/thermal_budget.py`)|
| `src/assets/brand/`  | Source SVGs for favicon and OG image                      |
| `scripts/`           | Build-time scripts (`pnpm brand:build`)                   |
| `.claude/`           | Project-scoped Claude Code config and scaffolding skills  |

Two Claude Code skills are installed under `.claude/skills/`:

* `aegis-devlog-new` — scaffold a new devlog MDX file
* `aegis-decision-new` — scaffold a new MADR ADR

Hand-editing always works as the fallback. See `CLAUDE.md` for the full
authoring contract and naming conventions.

## Brand assets

Sources live in `src/assets/brand/` as hand-built SVGs:

- `aegis-wordmark.svg`  — favicon source, monochrome "A" + thermal
  accent stripe under it (cyan to amber).
- `aegis-og.svg`        — Open Graph card source, 1200×630, full
  "AEGIS" wordmark on dark with the same accent stripe.

To regenerate the public/ exports (`favicon.svg`, `favicon.ico`,
`og/aegis-og.svg`, `og/aegis-og.png`):

```bash
pnpm brand:build
```

`scripts/build-brand-assets.mjs` uses `pnpm dlx sharp-cli` for SVG
rasterisation and `pnpm dlx png-to-ico` for ICO assembly. Neither is
a permanent project dependency. The script is invoked manually only
when the source SVGs change.

## Deploy to Cloudflare Pages

Static output. No SSR adapter for v0. Cloudflare Pages serves `dist/`
directly and respects `public/_headers` for caching + security.

### First deploy (one-time, dashboard)

1. Cloudflare Dashboard → **Workers & Pages** → **Create** → **Pages**
   → **Connect to Git**.
2. Authorise Cloudflare to access GitHub if not already done.
   Select repository: `ahmeteminyakar/aegis`.
3. Set up build:
   - **Production branch**: `main`
   - **Framework preset**: `Astro`
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
4. Environment variables → **Add variable**:
   - `NODE_VERSION` = `22`
5. **Save and Deploy**.

Cloudflare assigns a `<project>.pages.dev` URL on first deploy.

### After first deploy

Find and replace the placeholder host `aegis.ahmetyakar.dev` with the
actual deployed URL in these files:

```
astro.config.mjs         (site property)
public/robots.txt        (Sitemap line)
src/assets/brand/aegis-og.svg  (top-right meta line, optional)
```

`grep -rn "aegis.ahmetyakar.dev" .` finds every touchpoint. Each is
flagged with a `// TODO` comment or visible in the rendered output.

### Subsequent deploys

`git push` to `main`. Cloudflare Pages rebuilds and deploys
automatically. No manual step.

### Future: SSR

If a future iteration needs SSR (real newsletter persistence, dynamic
API routes), add `@astrojs/cloudflare` and change `output: 'static'`
to `output: 'server'` in `astro.config.mjs`.

## Design tokens

Defined in `src/styles/tokens.css` with Tailwind v4 `@theme inline`. To
edit:

```css
@theme inline {
  --color-bg: #0a0a0b;          /* page surface */
  --color-bg-elevated: #131316; /* card surface */
  --color-fg: #f4f4f4;          /* primary text */
  --color-fg-muted: #8a8a93;    /* secondary text — keep ≥4.5:1 contrast against bg */
  --color-accent-hot: #d96b3a;  /* TEC hot side */
  --color-accent-cold: #3fb4d4; /* TEC cold side */
  --color-grid: #1f1f24;        /* hairlines */
  --ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1);
}
```

Tokens are emitted as CSS variables AND as Tailwind utilities (e.g.
`bg-accent-hot`, `text-fg-muted`, `border-grid`). Do not use opacity
modifiers like `text-fg-muted/60` on body copy — they violate WCAG AA
on the dark surface.

## Lighthouse (desktop preset, headless Chrome)

```
performance      100
accessibility    100
best-practices   100
seo              100
```

Reproduce: `pnpm build && pnpm preview` in one terminal, then
`npx lighthouse@12 http://localhost:4321 --preset=desktop` in another.

## What this site is not

It is not a product launch page. There is no product yet. It is not a
sales funnel. The newsletter is a low-frequency build-updates signal.
It is not generic AI-templated, and the components are hand-built from
primitives (no shadcn, no Radix, no Headless UI).
