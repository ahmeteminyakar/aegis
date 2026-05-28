---
name: aegis-devlog-new
description: Use when the user wants to scaffold a new devlog entry for the Aegis project. Triggers on phrases like "new devlog entry", "draft a devlog entry about X", "scaffold devlog post", "start a devlog about X", or "add a devlog about X". Prompts for the title, derives a kebab-case slug, uses today's ISO date as the filename prefix and `date` frontmatter value, and writes `src/content/devlog/YYYY-MM-DD-slug.mdx` with full frontmatter and a starter body.
---

# aegis-devlog-new

Scaffolds a new MDX devlog entry for the Aegis project at
`D:/dev/projects/aegis/src/content/devlog/`.

## When to invoke

Trigger on user phrases like:

- "new devlog entry"
- "draft a devlog entry about X"
- "scaffold devlog post"
- "start a devlog about X"
- "add a devlog entry on X"

If the request is broader (e.g. "write me a devlog about the PID
loop"), still use this skill to scaffold first, then continue
populating the body inside the created file.

## What to do

1. Confirm the working directory is the Aegis project. The path
   `D:/dev/projects/aegis/src/content/devlog/` must be writable. If
   it does not exist or the user is in a different project, stop and
   ask.

2. Gather inputs. Ask the user for:

   - **Title** (required, sentence-case, no trailing period).
   - **Summary** (one sentence, max 200 chars; what the entry is
     about in plain language).
   - **Tags** (optional, comma-separated list of short kebab-case
     tags).

3. Compute the slug. From the title, lowercase, replace any run of
   non-alphanumeric characters with a single hyphen, strip leading
   and trailing hyphens. Cap at 60 characters.

4. Compute the ISO date. Today, in UTC, as `YYYY-MM-DD`.

5. Construct the filename: `YYYY-MM-DD-<slug>.mdx`. Before writing,
   check that this exact filename does not exist in
   `src/content/devlog/`. If it does, append `-2`, `-3`, ... to the
   slug until unique, and tell the user which collision was hit.

6. Write the file with this exact frontmatter, then a starter body:

   ```mdx
   ---
   title: "<Title>"
   date: <YYYY-MM-DD>
   summary: "<summary>"
   tags: [<comma-separated quoted tags or empty array>]
   draft: true
   ---

   <Opening paragraph stub. One sentence describing what this entry
   covers. Replace before publishing.>

   ## Context

   <What you were trying to do. Why now.>

   ## What happened

   <The actual sequence. Real numbers. Real screenshots/diagrams if any.>

   ## What I learned

   <The takeaway. Constraint discovered, assumption refuted, next thing
   to try.>
   ```

7. Frontmatter constraints to honour:

   - `draft: true` always for scaffolds. The author flips to `false`
     when publishing.
   - `summary` must be a single line, max 200 chars. Match the
     `src/content.config.ts` schema or the build will fail.
   - `tags` defaults to `[]` when none provided.

8. Confirm to the user: print the created path and a one-line
   reminder that the entry will not appear in the production build
   until `draft: false`. Suggest they preview with `pnpm dev`.

## Conventions to respect (from CLAUDE.md)

- No em-dashes in the body. Use periods, commas, colons, or
  restructure.
- No emojis.
- Engineer-honest tone. Name the constraint, name the prior art,
  ship the honest number.
- No marketing language.

## Out of scope

- Do not write the entry body for the user. The skill creates the
  scaffold; the user fills it.
- Do not modify `src/content.config.ts`, the landing-page Devlog
  section, or the RSS endpoint.
