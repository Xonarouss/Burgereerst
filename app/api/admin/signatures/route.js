import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(req) {
  const gate = requireAdmin(req);
  if (!gate.ok) return gate.res;

  const supabase = getSupabaseAdmin();
  const url = new URL(req.url);
  const limit = Math.min(parseInt(url.searchParams.get("limit") || "5000", 10) || 5000, 5000);

  const { data, error } = await supabase
    .from("petition_signatures")
    .select("id, full_name, city, email, verified, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 200 });
}

export async function DELETE(req) {
  const gate = requireAdmin(req);
  if (!gate.ok) return gate.res;

  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("petition_signatures").delete().eq("id", id);
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true }, { status: 200 });
}
