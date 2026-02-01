import { NextResponse } from "next/server";
import { listPublishedPosts } from "@/lib/blog";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function esc(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(req) {
  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl").replace(/\/$/, "");
  const posts = await listPublishedPosts({ limit: 50 });

  const items = posts
    .map((p) => {
      const url = `${siteUrl}/${p.locale || "nl"}/blog/${p.slug}`;
      const pub = p.published_at || p.updated_at || new Date().toISOString();
      return `\n<item>\n  <title>${esc(p.title)}</title>\n  <link>${esc(url)}</link>\n  <guid>${esc(url)}</guid>\n  <pubDate>${new Date(pub).toUTCString()}</pubDate>\n  <description>${esc(p.excerpt || "")}</description>\n</item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>BurgerEerst.nl – Blog</title>
    <link>${siteUrl}</link>
    <description>Updates, duiding en context van BurgerEerst.</description>
    <language>nl</language>
    ${items}
  </channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
