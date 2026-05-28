# CLAUDE.md (aegis)

Project-specific context for Claude Code sessions inside `D:/dev/projects/aegis/`.
The workspace-level rules in `D:/dev/CLAUDE.md` still apply — this file
adds Aegis-specific positioning, design rules, and stack constraints.

## What this is

Concept-stage wearable thermal-regulation wristband. A Peltier (TEC)
element mounted on the inner wrist (radial/ulnar artery surface) delivers
cooling or heating bursts. PWM-cycled for battery life. Adaptive mode
(skin-temp + ambient + IMU) and a single-touchpoint manual mode.

**No hardware yet. No prototype yet.** This repo is the public-facing
landing page where the build will be documented in the open.

Closest reference: Embr Wave. Same mechanism, different ownership
philosophy — open notebook, engineer-honest, MSc-application piece.

## Stack (do not deviate without asking)

- **Astro 5** with `output: 'static'`. No SSR adapter for v0. Cloudflare
  Pages serves `dist/` directly. Add `@astrojs/cloudflare` only if a
  future iteration needs real server endpoints.
- **Tailwind v4** via `@tailwindcss/vite`. Tokens live in
  `src/styles/tokens.css` inside `@theme inline { ... }`. No
  `tailwind.config.ts` — v4 keeps config in CSS.
- **React 19**, used ONLY for the Hero text-entrance island
  (`src/components/Hero.tsx`). Everything else is static Astro plus
  small inline `<script is:inline>` blocks for the nav-blur and the
  newsletter form.
- **Motion** (motion.dev, the React port of Framer Motion) for the
  Hero entrance. Used sparingly. No Lottie, no generic web animations.
- **MDX integration** is wired (`src/content.config.ts`) for the
  `devlog` collection. Empty for v0.
- **Self-hosted fonts** via `@fontsource`: IBM Plex Mono + Inter. No
  Google Fonts CDN. Berkeley Mono is the preferred mono once licensed
  — swap the import and the `--font-mono` token.
- **pnpm** for installs. Lockfile committed.

## Design rules (carry into every future session)

- NO shadcn, NO Radix, NO Headless UI. Components are primitives.
- NO emojis in code, in copy, or in commits.
- NO em-dashes in copy. Use periods, commas, colons, or restructure.
  This is on the workspace `feedback_no_em_dashes.md` rule.
- NO stock photos. NO 3D-rendered wristband renders. The device does
  not exist yet, do not lie about it. The hero falls back to a CSS
  gradient when `public/media/hero.mp4` is absent.
- NO buzzwords (revolutionary, game-changing, unleash). Engineer-honest
  tone throughout — name the constraint, name the prior art, ship the
  honest number.
- NO shipping placeholder copy that reads as marketing. The spec table
  values are placeholders; the COMMENTS in `Specs.astro` mark which
  numbers need tuning at the bench.

## Design tokens

`src/styles/tokens.css`:

| token                  | value     | use                       |
| ---------------------- | --------- | ------------------------- |
| `--color-bg`           | `#0a0a0b` | page surface              |
| `--color-bg-elevated`  | `#131316` | card surface              |
| `--color-fg`           | `#f4f4f4` | primary text              |
| `--color-fg-muted`     | `#8a8a93` | secondary text (≥4.5:1)   |
| `--color-accent-hot`   | `#d96b3a` | TEC hot side, warm bloom  |
| `--color-accent-cold`  | `#3fb4d4` | TEC cold side, cyan bloom |
| `--color-grid`         | `#1f1f24` | hairlines, gridlines      |
| `--font-mono`          | IBM Plex Mono              |                          |
| `--font-sans`          | Inter                      |                          |
| `--ease-cinematic`     | `cubic-bezier(0.16, 1, 0.3, 1)` | entrance, hover transitions |

Standard durations: 600ms entrance, 200ms interaction.

WCAG note: `text-fg-muted` on `bg` is 5.6:1 (passes). Any opacity
modifier on body copy (e.g. `text-fg-muted/60`) drops below 4.5:1 and
will fail the Lighthouse a11y check. Use spacing, size, or letter-spacing
for hierarchy instead of fading colors.

## Lighthouse expectation

All four categories ≥ 95 on desktop preset. Current build hits 100/100
across performance, accessibility, best-practices, and SEO. Bundle is
~3 KB inline JS + 99 KB gzip for the React island.

## Media handling

`public/media/` is gitignored except `.gitkeep`. Hero looks for:

- `public/media/hero.mp4` (H.264 1080p, < 5 MB, looping, ~10 s)
- `public/media/hero-poster.webp` (first-frame poster)

`Hero.astro` uses `fs.existsSync` at build time. If absent, renders a
CSS-only thermal-gradient fallback with a "backdrop · awaiting capture"
label. Site works at every stage between "no media" and "final cut".

## Devlog

`src/content/devlog/YYYY-MM-DD-slug.mdx`. The `YYYY-MM-DD-` prefix in
the filename is mandatory: it gives stable sort and is stripped from
the URL by `src/pages/devlog/[...slug].astro`. So
`2026-06-01-thermal-budget.mdx` becomes `/devlog/thermal-budget`.

Frontmatter schema in `src/content.config.ts`:

```ts
title:   string                 // required
date:    Date                   // required, ISO
summary: string                 // required, max 200 chars
tags:    string[]               // default []
draft:   boolean                // default false; true entries hidden in prod, visible in dev
cover?:  string                 // optional, public/devlog-covers/ path
```

Routes:

- `/devlog`            list of non-draft entries (drafts also visible in dev)
- `/devlog/<slug>`     single entry, wrapped in `src/layouts/DevlogEntry.astro`
- `/rss.xml`           RSS 2.0 feed, same filter and sort as the index

Sort: date desc, ties broken by filename id (deterministic).

Authoring path: either edit MDX by hand under `src/content/devlog/` or
invoke the `aegis-devlog-new` skill in a Claude session.

## File layout

```
.github/workflows/      CI build check
.claude/                project Claude config: settings.json + skills/
bom/                    bill of materials (components.csv) + README
decisions/              MADR ADRs (0001+) + README
sim/                    stdlib Python sims (thermal_budget.py + future)
public/
  media/                hero MP4 + WebP poster (gitignored)
  og/                   OG image + favicon (committed)
src/
  components/           Astro and React primitives (sections/, devlog/)
  content/devlog/       MDX entries (YYYY-MM-DD-slug.mdx)
  layouts/              Layout.astro, DevlogEntry.astro
  pages/                index.astro, devlog/, rss.xml.ts
  styles/               tokens.css, global.css
milestones.md           canonical roadmap (mirrored in Roadmap.astro for now)
```

`D:/dev/projects/aegis/` is a git repo; `dist/`, `node_modules/`,
`public/media/*`, `lh-report.json`, and `.astro/` are gitignored.

## Workflow

| Task                | Path                                                      |
| ------------------- | --------------------------------------------------------- |
| New devlog entry    | `aegis-devlog-new` skill, or hand-edit MDX                |
| New ADR             | `aegis-decision-new` skill, or hand-edit `decisions/NNNN-slug.md` |
| Update BOM          | Hand-edit `bom/components.csv`                            |
| Update milestones   | Hand-edit `milestones.md`                                 |
| Run thermal sim     | `python sim/thermal_budget.py`                            |
| Local preview       | `pnpm dev` (drafts visible) or `pnpm build && pnpm preview` (drafts hidden) |
| Deploy              | `git push` to main; Cloudflare Pages auto-rebuilds        |

The Obsidian vault at `D:/dev/notes/` is not coupled to this repo. If
Ahmet wants to draft entries in Obsidian first, the convention is to
write them in the vault, then move the MDX file into
`src/content/devlog/` once the date prefix is set and `draft: false`.

## Inspiration set (study, don't lift)

For info density + grid + monospace: `rauno.me`, `linear.app`,
`berkeleymono.com`.

For motion timing + cinematic scroll: `vercel.com`, `resend.com`,
`liveblocks.io`.

For open-source engineering aesthetic: `pmndrs.com`, `railway.app`.

Pattern attributions live in component file headers (e.g. "Linear's
mono eyebrow above headline"). When borrowing a pattern, name the
source in the comment so future sessions can compare.

## What this site is NOT

- Not a product launch page. There is no product.
- Not a sales funnel. The newsletter is signal, not lead capture.
- Not a Figma-to-React port. The components are hand-built from divs.
- Not a marketing piece. The copy reads like an engineer wrote it.
