/**
 * sync-news.ts
 *
 * Fetches RSS headlines from Indiana Business Journal and Inside Indiana Business,
 * writes merged results to public/data/news.json.
 *
 * Run via: npx tsx scripts/sync-news.ts
 * No API keys required — both feeds are public.
 */

import { writeFileSync } from "fs";
import { resolve } from "path";
import type { NewsItem } from "../lib/types";

const OUTPUT_PATH = resolve(process.cwd(), "public/data/news.json");
const MAX_PER_SOURCE = 10;

const SOURCES = [
  {
    id: "insideindiana" as const,
    label: "Inside Indiana Business",
    url: "https://www.insideindianabusiness.com/topics/news/feed",
  },
  // IBJ RSS feed requires a subscription — paywalled. Removed.
  // Add additional free Indiana business RSS feeds here as needed.
];

function extractTag(xml: string, tag: string): string {
  const re = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
  const m = xml.match(re);
  return (m?.[1] ?? m?.[2] ?? "").trim();
}

function extractItems(xml: string): { title: string; link: string; pubDate: string; description: string }[] {
  const items: { title: string; link: string; pubDate: string; description: string }[] = [];
  const itemRe = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(xml)) !== null) {
    const block = m[1];
    items.push({
      title: extractTag(block, "title"),
      link: extractTag(block, "link"),
      pubDate: extractTag(block, "pubDate"),
      description: extractTag(block, "description")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#8217;/g, "'")
        .replace(/&#8216;/g, "'")
        .replace(/&#8220;/g, '"')
        .replace(/&#8221;/g, '"')
        .trim()
        .slice(0, 220),
    });
  }
  return items;
}

async function fetchSource(source: (typeof SOURCES)[number]): Promise<NewsItem[]> {
  try {
    const res = await fetch(source.url, {
      headers: { "User-Agent": "FishersFoundersDash/1.0" },
    });
    if (!res.ok) {
      console.warn(`${source.label}: HTTP ${res.status}`);
      return [];
    }
    const xml = await res.text();
    const items = extractItems(xml).slice(0, MAX_PER_SOURCE);

    const news: NewsItem[] = items.map((item, i) => ({
      id: `${source.id}-${i}-${Buffer.from(item.link).toString("base64").slice(0, 12)}`,
      title: item.title,
      url: item.link,
      source: source.id,
      sourceLabel: source.label,
      publishedAt: item.pubDate ? new Date(item.pubDate).toISOString() : undefined,
      description: item.description || undefined,
    }));

    console.log(`${source.label}: fetched ${news.length} items`);
    return news;
  } catch (err) {
    console.error(`${source.label} failed:`, err);
    return [];
  }
}

async function main() {
  console.log("Syncing news feeds...");
  const results = await Promise.all(SOURCES.map(fetchSource));
  const all = results.flat().sort((a, b) => {
    if (!a.publishedAt || !b.publishedAt) return 0;
    return b.publishedAt.localeCompare(a.publishedAt);
  });

  writeFileSync(OUTPUT_PATH, JSON.stringify(all, null, 2));
  console.log(`Done. Wrote ${all.length} news items to public/data/news.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
