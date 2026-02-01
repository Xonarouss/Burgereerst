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

  const staticPaths = [
    "/nl",
    "/en",
    "/nl/visie",
    "/en/visie",
    "/nl/nexit",
    "/en/nexit",
    "/nl/over-ons",
    "/en/over-ons",
    "/nl/privacy",
    "/en/privacy",
    "/nl/disclaimer",
    "/en/disclaimer",
    "/nl/contact",
    "/en/contact",
    "/nl/blog",
    "/en/blog",
  ];

  const posts = await listPublishedPosts({ limit: 500 });
  const urls = [...staticPaths, ...posts.map((p) => `/${p.locale || "nl"}/blog/${p.slug}`)];

  const body = urls
    .map((path) => {
      const loc = `${siteUrl}${path}`;
      return `<url><loc>${esc(loc)}</loc></url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "no-store",
    },
  });
}
