import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";

// RSS 2.0 feed. Mirrors the /devlog index filtering and sort order:
// drafts excluded, date desc, ties broken by filename id.

export async function GET(context: APIContext) {
  const entries = (
    await getCollection("devlog", ({ data }) => !data.draft)
  ).sort((a, b) => {
    const dt = b.data.date.getTime() - a.data.date.getTime();
    return dt !== 0 ? dt : a.id.localeCompare(b.id);
  });

  return rss({
    title: "aegis devlog",
    description:
      "Build journal for the Aegis Peltier wristband. Honest about what works and what does not.",
    site: context.site!,
    items: entries.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: `/devlog/${entry.id.replace(/^\d{4}-\d{2}-\d{2}-/, "")}`,
      categories: entry.data.tags,
    })),
    customData: "<language>en-us</language>",
  });
}
