import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceRateLimit } from "@/lib/rateLimit";

export async function GET(req) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const rl = await enforceRateLimit(req, { action: "admin_blog_list", limit: 120, windowSec: 60, blockSec: 60 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });
  }

  const url = new URL(req.url);
  const limit = Math.min(1000, Math.max(1, parseInt(url.searchParams.get("limit") || "200", 10)));

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("blog_posts")
    .select("id, locale, slug, title, excerpt, author, cover_image_url, published, published_at, updated_at, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data: data || [] });
}

export async function POST(req) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const rl = await enforceRateLimit(req, { action: "admin_blog_write", limit: 60, windowSec: 60, blockSec: 120 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_json" }, { status: 400 });

  const {
    id,
    locale = "nl",
    slug,
    title,
    excerpt = "",
    author = "Chris",
    content_md = "",
    cover_image_url = null,
    cover_image_path = null,
    tags = [],
    published = false,
  } = body;

  if (!slug || !title) {
    return NextResponse.json({ error: "missing_slug_or_title" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();

  const row = {
    locale,
    slug,
    title,
    excerpt,
    author,
    content_md,
    cover_image_url,
    cover_image_path,
    tags,
    published: !!published,
    published_at: published ? (body.published_at || now) : null,
    updated_at: now,
  };

  // If id is provided, update; else insert.
  if (id) {
    const { data, error } = await supabase
      .from("blog_posts")
      .update(row)
      .eq("id", id)
      .select("id")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data?.id || id });
  }

  const { data, error } = await supabase
    .from("blog_posts")
    .insert({ ...row, created_at: now })
    .select("id")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, id: data?.id });
}

export async function DELETE(req) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const rl = await enforceRateLimit(req, { action: "admin_blog_delete", limit: 30, windowSec: 60, blockSec: 300 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });
  }

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();

  // If you want to remove a cover image as well, keep the path in DB; we only delete DB row here.
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
