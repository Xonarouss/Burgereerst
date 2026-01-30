import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sha256 } from "@/lib/crypto";
import { getBaseUrl } from "@/lib/url";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    const locale = searchParams.get("locale") === "en" ? "en" : "nl";

    const baseUrl = getBaseUrl(req);
    const go = (code) => NextResponse.redirect(new URL(`/${locale}?verify=${code}`, baseUrl));

    if (!token || !email) {
      return go("missing");
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
      return go("notfound");
    }

    if (data.verified) {
      return go("already");
    }

    if (data.verify_token_hash !== tokenHash) {
      return go("invalid");
    }

    const { error: updErr } = await supabase
      .from("petition_signatures")
      .update({ verified: true, verified_at: new Date().toISOString(), verify_token_hash: null })
      .eq("id", data.id);

    if (updErr) {
      console.error(updErr);
      return go("error");
    }

    return go("ok");
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL(`/nl?verify=error`, getBaseUrl(req)));
  }
}