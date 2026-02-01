import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceRateLimit } from "@/lib/rateLimit";
import { randomToken } from "@/lib/crypto";

export async function POST(req) {
  const auth = requireAdmin(req);
  if (!auth.ok) return auth.res;

  const rl = await enforceRateLimit(req, { action: "admin_blog_upload", limit: 30, windowSec: 60, blockSec: 300 });
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });
  }

  const bucket = process.env.BLOG_STORAGE_BUCKET || "blog-images";
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "invalid_form" }, { status: 400 });

  const file = form.get("file");
  const folder = (form.get("folder") || "posts").toString();

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  // Basic extension guard
  const name = (file.name || "upload").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : "bin";
  const allowed = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
  if (!allowed.has(ext)) {
    return NextResponse.json({ error: "unsupported_file_type" }, { status: 400 });
  }

  const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "-").replace(/^\/+/, "").slice(0, 120) || "posts";
  const path = `${safeFolder}/${Date.now()}-${randomToken(8)}.${ext}`;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.storage.from(bucket).upload(path, bytes, {
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Requires the bucket to be public.
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data?.publicUrl, path, bucket });
}
