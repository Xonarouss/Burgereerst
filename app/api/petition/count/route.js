import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true });

    if (error) throw error;
    return NextResponse.json({ count: count ?? 0 }, { status: 200 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
