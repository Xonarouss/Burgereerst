import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceRateLimit } from "@/lib/rateLimit";
import { randomToken, sha256 } from "@/lib/crypto";
import { sendBlogSubscribeConfirmEmail } from "@/lib/email";
import { getConfiguredSiteUrl, getBaseUrl } from "@/lib/url";

const Body = z.object({
  email: z.string().email(),
  locale: z.enum(["nl", "en"]).default("nl"),
});

export async function POST(req) {
  const rl = await enforceRateLimit(req, { action: "blog_subscribe_email", limit: 10, windowSec: 3600, blockSec: 3600 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const { email, locale } = parsed.data;

  const supabase = getSupabaseAdmin();

  const emailNorm = email.toLowerCase().trim();
  const emailHash = sha256(emailNorm);

  // If there's an existing unconfirmed subscription, don't spam confirm emails.
  // We only resend at most once per 10 minutes per email.
  const { data: existing } = await supabase
    .from("blog_subscribers")
    .select("id, active, updated_at")
    .eq("email_hash", emailHash)
    .maybeSingle();

  const nowIso = new Date().toISOString();

  if (existing && existing.active === false && existing.updated_at) {
    const last = new Date(existing.updated_at).getTime();
    const now = Date.now();
    if (Number.isFinite(last) && now - last < 10 * 60 * 1000) {
      // Pretend it's fine: UX stays smooth and we avoid double sends.
      return NextResponse.json({ ok: true });
    }
  }

  const token = randomToken(24);
  const tokenHash = sha256(token);

  // Upsert by email_hash
  const { error } = await supabase.from("blog_subscribers").upsert(
    {
      email: emailNorm,
      email_hash: emailHash,
      locale,
      active: false,
      confirm_token_hash: tokenHash,      updated_at: nowIso,
    },
    { onConflict: "email_hash" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Build absolute verify URL without ever falling back to localhost in production.
  const baseUrl = getConfiguredSiteUrl() || getBaseUrl(req);
  const verifyUrl = `${baseUrl}/api/blog/subscribe/verify?token=${encodeURIComponent(token)}&locale=${encodeURIComponent(locale)}`;

  try {
    await sendBlogSubscribeConfirmEmail({ to: email, verifyUrl, locale });
  } catch (e) {
    return NextResponse.json({ error: e.message || "email_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
