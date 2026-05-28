# 0001. Stack: Astro 5 + Tailwind v4 + Motion + MDX + Cloudflare Pages

* Status: Accepted
* Date: 2026-05-29
* Deciders: Ahmet Emin Yakar

## Context

Aegis is a concept-stage hardware project. The public-facing site needs to:

1. Communicate the mechanism honestly to an engineering audience.
2. Host a growing devlog of bench notes, sim results, and build photos.
3. Score well on Lighthouse so it is not embarrassing to link.
4. Be cheap to operate and easy to update from any machine that can
   `git push`.
5. Not look AI-generated. Hand-built primitives only.

The author writes Python, C, and increasingly TypeScript. Build pipeline
must be runnable on a low-spec laptop and deployable without paying for
SSR runtime.

## Decision

| Layer            | Choice                                            |
| ---------------- | ------------------------------------------------- |
| Framework        | Astro 5 with `output: 'static'`                   |
| Styling          | Tailwind v4 via `@tailwindcss/vite`, tokens in `@theme inline` (CSS, no JS config) |
| Interactivity    | Astro islands. React 19 used ONLY for the Hero entrance. |
| Motion           | `motion` (motion.dev, Framer Motion's React port) |
| Content          | MDX for the devlog, via `@astrojs/mdx`            |
| RSS              | `@astrojs/rss` as a route endpoint (not a registered integration) |
| Reading time     | `reading-time` (small, no deps)                   |
| Fonts            | Self-hosted Inter + IBM Plex Mono via `@fontsource` |
| Package manager  | pnpm 11                                           |
| Host             | Cloudflare Pages, serving `dist/` directly        |

No SSR adapter. No shadcn, no Radix, no Headless UI. No date library.
No CSS framework beyond Tailwind. The dependency tree is the smallest
that delivers the brief.

## Consequences

Positive:

* Lighthouse 100 / 100 / 100 / 100 on desktop preset, including the
  Hero React island.
* `pnpm build` finishes in ~2 s. Cloudflare Pages deploys are quick.
* MDX gives the devlog real component embedding (sim plots, diagrams)
  without a CMS.
* Self-hosted fonts: privacy plus one less origin to round-trip.
* Static output is auditable: every URL is a file in `dist/`.

Negative / accepted:

* The Hero island ships ~99 KB gzip of React + Motion for a one-shot
  text reveal. A CSS-only refactor is on the backlog (see roadmap).
* Tailwind v4 is recent. The `@theme inline` pattern is documented but
  examples in the wild are still thin; expect to read the v4 docs when
  in doubt.
* Hand-rolled `.prose-mono` instead of `@tailwindcss/typography` means
  any new MDX tag (table, footnote) needs a CSS rule before it renders
  cleanly.

## Alternatives considered

* **Next.js + Vercel.** Rejected. Heavier runtime, SSR not needed, Vercel
  egress pricing worse for a high-image-content devlog.
* **Astro 4 + Tailwind v3.** Rejected. Schema for content collections and
  `@theme` syntax both got cleaner in v5 / v4 respectively; no upgrade
  cost paid later.
* **shadcn/ui or Radix primitives.** Rejected. They optimize for shipping
  generic SaaS UIs fast. The point of this site is to not look like
  generic SaaS UI.
* **Hosted Google Fonts CDN.** Rejected. Privacy plus an additional TCP
  round-trip on first paint.
* **dayjs / date-fns.** Rejected. Native `Intl.DateTimeFormat` and ISO
  string slicing cover every case the devlog needs.
* **MDX via `@mdx-js/mdx` directly.** Rejected. The Astro integration
  is the supported path and ships Shiki for code highlighting.
