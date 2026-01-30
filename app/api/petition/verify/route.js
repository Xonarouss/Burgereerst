import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sha256 } from "@/lib/crypto";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const locale = searchParams.get("locale") === "en" ? "en" : "nl";

    if (!token || !email) {
      return NextResponse.redirect(new URL(`/${locale}?verify=missing`, req.url));
    }

    const tokenHash = sha256(token);
    const emailNorm = email.trim().toLowerCase();
    const emailHash = sha256(emailNorm);

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("petition_signatures")
      .select("id, verified, verify_token_hash")
      .eq("email_hash", emailHash)
      .maybeSingle();

    if (error || !data) {
      return NextResponse.redirect(new URL(`/${locale}?verify=notfound`, req.url));
    }

    if (data.verified) {
      return NextResponse.redirect(new URL(`/${locale}?verify=already`, req.url));
    }

    if (data.verify_token_hash !== tokenHash) {
      return NextResponse.redirect(new URL(`/${locale}?verify=invalid`, req.url));
    }

    const { error: updErr } = await supabase
      .from("petition_signatures")
      .update({ verified: true, verified_at: new Date().toISOString(), verify_token_hash: null })
      .eq("id", data.id);

    if (updErr) {
      console.error(updErr);
      return NextResponse.redirect(new URL(`/${locale}?verify=error`, req.url));
    }

    return NextResponse.redirect(new URL(`/${locale}?verify=ok`, req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL(`/nl?verify=error`, req.url));
  }
}
