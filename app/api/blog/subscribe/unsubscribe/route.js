import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { makeUnsubscribeToken, sha256 } from "@/lib/crypto";
import { getConfiguredSiteUrl, getBaseUrl } from "@/lib/url";

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email");
  const token = url.searchParams.get("token");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "nl";

  const baseUrl = getConfiguredSiteUrl() || getBaseUrl(req);

  if (!email || !token) {
    return NextResponse.redirect(new URL(`/${locale}/blog?unsub=fail`, baseUrl));
  }

  const expected = makeUnsubscribeToken(email);
  if (token !== expected) {
    return NextResponse.redirect(new URL(`/${locale}/blog?unsub=fail`, baseUrl));
  }

  const supabase = getSupabaseAdmin();
  const emailHash = sha256(String(email).toLowerCase().trim());

  const { error } = await supabase
    .from("blog_subscribers")
    .update({ active: false, unsubscribed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("email_hash", emailHash);

  if (error) {
    return NextResponse.redirect(new URL(`/${locale}/blog?unsub=fail`, baseUrl));
  }

  return NextResponse.redirect(new URL(`/${locale}/blog?unsub=ok`, baseUrl));
}
