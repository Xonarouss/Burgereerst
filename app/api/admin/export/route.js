import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/adminAuth";

function toCsv(rows) {
  const header = ["id", "full_name", "city", "email", "verified", "created_at"];
  const esc = (v) => {
    const s = String(v ?? "");
    const needs = /[\n\r,\"]/g.test(s);
    const out = s.replace(/\"/g, '""');
    return needs ? `"${out}"` : out;
  };

  const lines = [header.join(",")];
  for (const r of rows) {
    lines.push(
      [r.id, r.full_name, r.city, r.email, r.verified, r.created_at].map(esc).join(",")
    );
  }
  return lines.join("\n");
}

export async function GET(req) {
  const gate = requireAdmin(req);
  if (!gate.ok) return gate.res;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("petition_signatures")
    .select("id, full_name, city, email, verified, created_at")
    .order("created_at", { ascending: false })
    .limit(100000);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  const csv = toCsv(data || []);
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=burgereerst-signatures.csv",
    },
  });
}
