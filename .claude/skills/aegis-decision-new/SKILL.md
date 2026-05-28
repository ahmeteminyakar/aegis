---
name: aegis-decision-new
description: Use when the user wants to record a new architecture decision (ADR) for the Aegis project. Triggers on phrases like "new ADR", "record a decision", "document the decision about X", "write an ADR about X", or "add an architecture decision record". Finds the next ADR number by scanning `decisions/`, prompts for a title, and writes `decisions/NNNN-slug.md` from the MADR template with Status=Proposed and today's date.
---

# aegis-decision-new

Scaffolds a new MADR-format Architecture Decision Record at
`D:/dev/projects/aegis/decisions/`.

## When to invoke

Trigger on user phrases like:

- "new ADR"
- "record a decision"
- "document the decision about X"
- "write an ADR about X"
- "add an architecture decision record"

If the request is broader ("write a decision record for switching from
Astro to Next"), still use this skill to scaffold the file first, then
help populate the sections.

## What to do

1. Confirm the working directory is the Aegis project. The path
   `D:/dev/projects/aegis/decisions/` must exist. If the user is in
   a different project, stop and ask.

2. Scan `decisions/` for existing `NNNN-*.md` files. The next number
   is the highest existing NNNN plus one, zero-padded to four
   digits. If `decisions/` has only `README.md` and no numbered ADRs,
   the next number is `0001`.

3. Ask the user for:

   - **Title** (short, captures the decision; e.g. "Switch to Zephyr
     RTOS for firmware").
   - **One-line context** (why this decision is being made now).

4. Compute the slug. From the title, lowercase, replace any run of
   non-alphanumeric characters with a single hyphen, strip leading
   and trailing hyphens. Cap at 60 characters.

5. Construct the filename: `decisions/NNNN-<slug>.md`. Confirm it
   does not already exist.

6. Write the file with this exact MADR template:

   ```markdown
   # NNNN. <Title>

   * Status: Proposed
   * Date: <YYYY-MM-DD today>
   * Deciders: Ahmet Emin Yakar

   ## Context

   <The one-line context, expanded. What shaped the need for this
   decision? What constraints apply? What is the prior art?>

   ## Decision

   <The decision itself, stated plainly. If a table fits better than
   prose, use a table.>

   ## Consequences

   Positive:

   * <what gets better>

   Negative or accepted:

   * <what gets worse or what tradeoff is acknowledged>

   ## Alternatives considered

   * **<Alternative 1>.** <Why rejected.>
   * **<Alternative 2>.** <Why rejected.>
   ```

7. After writing, also append the new entry to the Index section of
   `decisions/README.md`, in numerical order:

   ```markdown
   * [NNNN. <Title>](NNNN-<slug>.md)
   ```

8. Confirm to the user: print the created path and remind them to
   flip Status from Proposed to Accepted (or Rejected) once the
   decision lands.

## Conventions to respect (from CLAUDE.md and decisions/README.md)

- MADR format. Sections in this exact order: Status, Date, Deciders,
  Context, Decision, Consequences, Alternatives.
- Keep each ADR under 200 lines. If longer, the decision is probably
  two decisions.
- No em-dashes in the body. Use periods, commas, colons, or
  restructure.
- No emojis.
- Status values: Proposed, Accepted, Deprecated, Superseded.
- Never reuse numbers. Superseded decisions stay; write a new one.

## Out of scope

- Do not populate the Context, Decision, or Consequences with
  speculative content. Leave the template stubs for the user to
  fill.
- Do not modify other ADRs except to update the index in
  `decisions/README.md`.
