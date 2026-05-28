import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// devlog entries live at src/content/devlog/YYYY-MM-DD-slug.mdx
// The date-prefix in the filename is mandatory: it gives stable
// sort and is stripped from the URL by src/pages/devlog/[...slug].astro.
// summary is required (used as the listing teaser, the <meta description>
// for the entry page, and the RSS item description), capped at 200 chars
// so it stays a teaser instead of growing into a second body.
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/devlog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    summary: z.string().max(200),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    cover: z.string().optional(),
  }),
});

export const collections = { devlog };
