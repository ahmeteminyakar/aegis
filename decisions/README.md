# Decisions

Architecture Decision Records for the Aegis project. Format: MADR
(Markdown Architectural Decision Records).

## Convention

* One file per decision. Number them 0001, 0002, ... in order. Do not
  reuse numbers when a decision is superseded; mark Status accordingly
  and write a new ADR.
* Filename: `NNNN-kebab-case-slug.md`.
* Sections, in order: Status, Date, Deciders, Context, Decision,
  Consequences, Alternatives. Keep each ADR under 200 lines. If it
  needs more, the decision is probably two decisions.
* Status values: Proposed, Accepted, Deprecated, Superseded.

## When to write one

If the answer to any of these is yes:

* This choice will be expensive to reverse in 6 months.
* Future-me will not remember why this was decided this way.
* The alternative is non-obvious and would have been a reasonable
  pick.
* The decision binds a class of downstream choices (a stack, a
  language convention, a deployment topology).

For day-to-day code structure decisions that are obvious from the
diff, do not write one. ADRs are for load-bearing choices.

## How to write one

Two paths:

1. Hand-edit. Copy an existing ADR as the template and edit.
2. Use the `aegis-decision-new` Claude skill. It finds the next
   number, prompts for a title, and writes a Proposed-status MADR
   stub.

## Index

* [0001. Stack: Astro 5 + Tailwind v4 + Motion + MDX + Cloudflare Pages](0001-stack-decision.md)
* [0002. Design language: engineer-honest, thermal-duality, no AI slop](0002-design-language.md)
* [0003. Prototype hardware vs production-target parts](0003-prototype-vs-production-hardware.md)

## References

* [MADR project](https://adr.github.io/madr/)
* Michael Nygard's original ADR write-up (2011), the source pattern
  for MADR.
