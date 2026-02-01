import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceRateLimit } from "@/lib/rateLimit";
import { randomToken, sha256 } from "@/lib/crypto";
import { sendBlogSubscribeConfirmEmail } from "@/lib/email";

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
  const token = randomToken(24);
  const tokenHash = sha256(token);
  const emailHash = sha256(email.toLowerCase().trim());

  // Upsert by email_hash
  const { error } = await supabase.from("blog_subscribers").upsert(
    {
      email,
      email_hash: emailHash,
      locale,
      active: false,
      confirm_token_hash: tokenHash,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "email_hash" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl";
  const verifyUrl = `${baseUrl}/api/blog/subscribe/verify?token=${encodeURIComponent(token)}&locale=${encodeURIComponent(locale)}`;

  try {
    await sendBlogSubscribeConfirmEmail({ to: email, verifyUrl, locale });
  } catch (e) {
    return NextResponse.json({ error: e.message || "email_failed" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
