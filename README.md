# aegis

Landing page for **Aegis**, a wearable Peltier wristband for adaptive
thermal-comfort bursts. Concept stage. No hardware yet. The site is
where the build is documented in the open.

```
Astro 5  ·  Tailwind v4 (@theme inline)  ·  Motion  ·  pnpm  ·  Cloudflare Pages
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
| Hero               | `src/components/sections/Hero.astro` +<br/>`src/components/Hero.tsx` | React island (`client:load`), Motion |
| Physics + diagram  | `src/components/sections/Physics.astro` +<br/>`src/components/sections/PhysicsDiagram.astro` | static |
| How it works       | `src/components/sections/HowItWorks.astro` | static    |
| Specs              | `src/components/sections/Specs.astro`      | static    |
| Roadmap            | `src/components/sections/Roadmap.astro`    | static    |
| Devlog placeholder | `src/components/sections/Devlog.astro`     | static    |
| Newsletter         | `src/components/sections/Newsletter.astro` | inline JS |
| Footer             | `src/components/sections/Footer.astro`     | static    |

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

```
src/content/devlog/2026-q3-bench-prototype.mdx
```

Frontmatter (see schema in `src/content.config.ts`):

```mdx
---
title: "Bench prototype, first runs"
date: 2026-08-12
summary: "PWM at 4 kHz. PID coefficients off by a factor of three."
---

Body in MDX. Code blocks render with shiki.
```

Push to `main`. Cloudflare Pages auto-rebuilds.

## Deploying to Cloudflare Pages

Static output. No SSR adapter for v0.

1. Push this repo to GitHub.
2. In Cloudflare Pages: **Create project → Connect to Git → select repo**.
3. Build command: `pnpm build`
4. Build output directory: `dist`
5. Environment: `NODE_VERSION=22`

Pages auto-rebuilds on push to `main`.

If a future iteration needs SSR (real newsletter persistence, dynamic
API routes), add `@astrojs/cloudflare` and change `output: 'static'` to
`output: 'server'` in `astro.config.mjs`.

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
