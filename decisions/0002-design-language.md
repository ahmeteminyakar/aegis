# 0002. Design language: engineer-honest, thermal-duality, no AI slop

* Status: Accepted
* Date: 2026-05-29
* Deciders: Ahmet Emin Yakar

## Context

The site shipping looks like a build journal, not a product launch. The
device does not exist yet. Anyone who lands here is either an engineer
who can smell hype from a kilometre, or a future admissions committee
who will read this as part of an application portfolio. Both audiences
reward signal density, attribution, and honest constraint-talk; both
penalise marketing posture.

There is also a default-failure mode to avoid. AI image generation and
component libraries have given every concept-stage hardware page the
same visual fingerprint: 3D wristband render on a purple gradient,
shadcn cards in a three-column grid, "revolutionary" in the headline.
Aegis must not look like that.

## Decision

### Surface and structure

* Dark surface as the only theme. `--color-bg: #0a0a0b`. No light mode.
* Tight 8 px / hairline grid. Sections delimited by 1 px rules in
  `--color-grid`, not by drop shadows.
* Two thermal accents only: `--color-accent-hot: #d96b3a` (amber, TEC
  hot side) and `--color-accent-cold: #3fb4d4` (cyan, cold side). Used
  sparingly, never both on the same component except in the wrist
  diagram.

### Typography

* Body: **Inter** at 400/500/600/700. Display headlines down-track at
  `-0.02em` for compactness without smushing.
* Mono: **IBM Plex Mono** at 400/500. Berkeley Mono is the preferred
  swap once licensed. Used for eyebrows, ordinals, numeric values,
  meta rows, diagram labels, code, and the wordmark. Mono carries the
  "this was built by an engineer" signal more reliably than any image.
* No web font CDN. `@fontsource` self-hosting.

### Motion

* `--ease-cinematic: cubic-bezier(0.16, 1, 0.3, 1)`. 600 ms entrance,
  200 ms interaction. Stagger of 80 ms between siblings on the Hero.
* `prefers-reduced-motion: reduce` short-circuits all animations to
  10 ms.
* No Lottie, no generic web-animation packs. Motion library only.

### Components

* Hand-built from `div`s. No shadcn, no Radix, no Headless UI.
* Pattern attribution lives in each component file's top comment,
  naming the source the pattern was studied from (Linear, Vercel,
  Rauno, etc.). Borrow patterns, not markup.
* Cards are bordered, not shadowed. Inputs are 1 px hairlines. Buttons
  are mono pills with the inverse-fill hover.

### Diagrams

* SVG, hand-coded in the component. The wrist cross-section is the
  reference: leader lines, mono labels, scale bar, hot/cold arrows.
* No downloaded assets. No Mermaid for technical diagrams (Mermaid is
  fine for control-flow sketches inside devlog entries; not for the
  hero illustration).

### Copy

* Engineer-honest. Name the constraint, name the prior art, ship the
  honest number.
* No em-dashes. Use periods, commas, colons, or restructure. (Workspace
  feedback rule.)
* No emojis in code, copy, or commits.
* No marketing buzzwords (revolutionary, game-changing, unleash).
* Placeholder numbers are marked as such in code comments or in the
  source-of-truth file's notes column.

## Anti-patterns (do not ship these)

* 3D-rendered wristband float-shots before there is a wristband.
* Stock photography of wrists, lab benches, or hands holding devices.
* Three-column or four-column or 2×2 generic card grids on marketing
  surfaces. (Editorial / timeline / asymmetric layouts only.)
* "Trusted by" logo bars when nobody trusts the project yet.
* Testimonials when there are none.
* Cursor-trail effects, scroll-jacking, parallax for its own sake.

## Consequences

Positive:

* The site reads as designed, not templated. Adversarial test: if a
  shadcn fingerprint scanner looked at the markup, it should find
  nothing.
* Tokens are documented in one file (`src/styles/tokens.css`) and any
  future component reuses them by name, not by hex.
* The anti-patterns list short-circuits a class of design debates
  before they start.

Negative / accepted:

* Higher per-component build cost. Adding a tooltip or a modal means
  building one, not importing one.
* Onboarding a contributor takes longer because there is no Storybook
  of pre-built primitives.

## Alternatives considered

* **shadcn/ui starter.** Rejected. Generic SaaS aesthetic, Radix
  dependency, anyone familiar with the look would identify the site
  as template-built within seconds.
* **Light mode + dark mode toggle.** Rejected for v0. Concept-stage
  projects do not need a theming system; the thermal-duality reads as
  intentional only against deep dark.
* **Sans-everything with no mono.** Rejected. The mono carries the
  engineering signal; removing it would make the site indistinguishable
  from a wellness brand landing page.
* **Render the wristband in Blender.** Rejected. The wristband does not
  exist. A render would lie. The hero falls back to a CSS thermal
  gradient until real footage arrives at `public/media/hero.mp4`.
