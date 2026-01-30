export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "5", 10) || 5, 20);

    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("petition_signatures")
      .select("id, full_name, city, verified, created_at")
      .eq("verified", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;

    const items = (data || []).map((r) => ({
      id: r.id,
      full_name: r.full_name || "Anoniem",
      city: r.city || "",
      created_at: r.created_at,
    }));

    return NextResponse.json({ items }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
