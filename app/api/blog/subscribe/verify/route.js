import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sha256 } from "@/lib/crypto";
import { getConfiguredSiteUrl, getBaseUrl } from "@/lib/url";

export async function GET(req) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token");
  const locale = url.searchParams.get("locale") === "en" ? "en" : "nl";
  const baseUrl = getConfiguredSiteUrl() || getBaseUrl(req);
  if (!token) return NextResponse.redirect(new URL(`/${locale}/blog?sub=fail`, baseUrl));

  const tokenHash = sha256(token);
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from("blog_subscribers")
    .update({ active: true, confirmed_at: new Date().toISOString(), confirm_token_hash: null, updated_at: new Date().toISOString() })
    .eq("confirm_token_hash", tokenHash)
    .select("id")
    .maybeSingle();

  if (error || !data?.id) {
    return NextResponse.redirect(new URL(`/${locale}/blog?sub=fail`, baseUrl));
  }

  return NextResponse.redirect(new URL(`/${locale}/blog?sub=ok`, baseUrl));
}
