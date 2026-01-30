import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { hashIp, randomToken, sha256 } from "@/lib/crypto";
import { sendVerifyEmail } from "@/lib/email";

const Schema = z.object({
  locale: z.enum(["nl", "en"]).default("nl"),
  full_name: z.string().min(2).max(80),
  city: z.string().min(2).max(80),
  email: z.string().email().max(200),
  consent_privacy: z.boolean(),
  website: z.string().optional(), // honeypot
});

export async function POST(req) {
  try {
    const json = await req.json();
    const input = Schema.parse(json);

    // bot trap
    if (input.website && input.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    if (!input.consent_privacy) {
      return NextResponse.json({ error: "consent_required" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    const emailNorm = input.email.trim().toLowerCase();
    const emailHash = sha256(emailNorm);

    // check existing
    const { data: existing, error: e1 } = await supabase
      .from("petition_signatures")
      .select("id, verified")
      .eq("email_hash", emailHash)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ code: "ALREADY" }, { status: 409 });
    }
    if (e1 && e1.code !== "PGRST116") {
      // ignore maybeSingle not found code; else error
    }

    const token = randomToken(24);
    const tokenHash = sha256(token);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
    const ua = req.headers.get("user-agent") || null;

    const { error: insErr } = await supabase.from("petition_signatures").insert({
      full_name: input.full_name.trim(),
      city: input.city.trim(),
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
      console.error(insErr);
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl";
    const verifyUrl = `${siteUrl}/api/petition/verify?token=${token}&email=${encodeURIComponent(emailNorm)}&locale=${input.locale}`;

    await sendVerifyEmail({ to: emailNorm, verifyUrl, locale: input.locale });

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
}
