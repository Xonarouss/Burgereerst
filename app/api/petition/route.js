import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashIp, randomToken, sha256 } from "@/lib/crypto";
import { sendVerifyEmail } from "@/lib/email";
import { getBaseUrl } from "@/lib/url";

const Schema = z
  .object({
    locale: z.enum(["nl", "en"]).default("nl"),
    anonymous: z.boolean().optional().default(false),
    full_name: z.string().max(80).optional().default(""),
    city: z.string().max(80).optional().default(""),
    email: z.string().email().max(200),
    consent_privacy: z.boolean(),
    website: z.string().optional(), // honeypot
    recaptcha_token: z.string().optional(),
  })
  .superRefine((val, ctx) => {
    if (!val.anonymous) {
      if (!val.full_name || val.full_name.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "full_name_required",
          path: ["full_name"],
        });
      }
      if (!val.city || val.city.trim().length < 2) {
        ctx.addIssue({
          code: "custom",
          message: "city_required",
          path: ["city"],
        });
      }
    }
  });

async function verifyRecaptcha({ token, ip }) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  // If no secret is configured, skip verification (useful for local/dev).
  if (!secret) return { ok: true, skipped: true };
  if (!token) return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (ip) body.set("remoteip", ip);

  const controller = new AbortController();
  const timeoutMs = parseInt(process.env.RECAPTCHA_TIMEOUT_MS || "6000", 10);
  const t = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const resp = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
      signal: controller.signal,
      cache: "no-store",
    });

    const data = await resp.json().catch(() => null);
    if (!data?.success) return { ok: false, reason: "failed", data };

    // For reCAPTCHA v3 you get a score. Default accept threshold 0.5.
    const score = typeof data.score === "number" ? data.score : 1;
    const minScore = parseFloat(process.env.RECAPTCHA_MIN_SCORE || "0.5");
    if (score < minScore) return { ok: false, reason: "low_score", score };

    return { ok: true, score };
  } catch {
    return { ok: false, reason: "network_error" };
  } finally {
    clearTimeout(t);
  }
}

function getClientIp(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
}

export async function POST(req) {
  try {
    const json = await req.json();

    let input;
    try {
      input = Schema.parse(json);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return NextResponse.json(
          { error: "validation_error", issues: e.issues },
          { status: 400 }
        );
      }
      throw e;
    }

    // bot trap (honeypot)
    if (input.website && input.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!input.consent_privacy) {
      return NextResponse.json({ error: "consent_required" }, { status: 400 });
    }

    const ip = getClientIp(req);

    const captcha = await verifyRecaptcha({ token: input.recaptcha_token, ip });
    if (!captcha.ok) {
      return NextResponse.json(
        { error: "captcha_failed", reason: captcha.reason },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const emailNorm = input.email.trim().toLowerCase();
    const emailHash = sha256(emailNorm);
    const siteUrl = getBaseUrl(req);

    // check existing
    const { data: existing, error: e1 } = await supabase
      .from("petition_signatures")
      .select("id, verified")
      .eq("email_hash", emailHash)
      .maybeSingle();

    // If the email already exists but is not verified yet, resend a fresh link.
    if (existing) {
      if (existing.verified) {
        return NextResponse.json({ code: "ALREADY_VERIFIED" }, { status: 409 });
      }

      const token = randomToken(24);
      const tokenHash = sha256(token);

      const { error: updErr } = await supabase
        .from("petition_signatures")
        .update({ verify_token_hash: tokenHash })
        .eq("id", existing.id);

      if (updErr) {
        console.error("petition: token update failed", updErr);
        return NextResponse.json({ error: "db_error" }, { status: 500 });
      }

      const verifyUrl = `${siteUrl}/api/petition/verify?token=${token}&email=${encodeURIComponent(
        emailNorm
      )}&locale=${input.locale}`;

      let emailSent = true;
      try {
        await sendVerifyEmail({ to: emailNorm, verifyUrl, locale: input.locale });
      } catch (mailErr) {
        emailSent = false;
        console.error("petition: resend verify email failed", mailErr);
      }

      return NextResponse.json({ ok: true, code: "RESENT", emailSent }, { status: 200 });
    }

    // If Supabase returned an error (other than not found), log it but continue to attempt insert.
    if (e1 && e1.code !== "PGRST116") {
      console.error("petition: existing check error", e1);
    }

    const token = randomToken(24);
    const tokenHash = sha256(token);

    const ua = req.headers.get("user-agent") || null;

    const { error: insErr } = await supabase.from("petition_signatures").insert({
      full_name: input.anonymous ? "Anoniem" : input.full_name.trim(),
      city: input.anonymous ? "" : input.city.trim(),
      email: emailNorm,
      email_hash: emailHash,
      consent_privacy: true,
      verify_token_hash: tokenHash,
      ip_hash: hashIp(ip),
      user_agent: ua,
    });

    if (insErr) {
      // duplicate race condition
      if (String(insErr.message || "").toLowerCase().includes("duplicate")) {
        return NextResponse.json({ code: "ALREADY" }, { status: 409 });
      }
      console.error("petition: insert failed", insErr);
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }

    const verifyUrl = `${siteUrl}/api/petition/verify?token=${token}&email=${encodeURIComponent(
      emailNorm
    )}&locale=${input.locale}`;

    // Best-effort email: signature is saved; don't show "try again" just because email failed.
    let emailSent = true;
    try {
      await sendVerifyEmail({ to: emailNorm, verifyUrl, locale: input.locale });
    } catch (mailErr) {
      emailSent = false;
      console.error("petition: resend verify email failed", mailErr);
    }

    return NextResponse.json({ ok: true, emailSent }, { status: 200 });
  } catch (err) {
    console.error("petition: unexpected error", err);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
