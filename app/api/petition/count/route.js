export const dynamic = "force-dynamic";
export const revalidate = 0;

import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

const MILESTONES = [
  100,
  250,
  500,
  1000,
  2500,
  5000,
  10000,
  25000,
  50000,
  100000,
  250000,
  500000,
  1000000,
];

function pickNextMilestone(count) {
  for (const m of MILESTONES) {
    if (count < m) return m;
  }
  // keep scaling after 1M
  const last = MILESTONES[MILESTONES.length - 1];
  let m = last;
  while (count >= m) m *= 2;
  return m;
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { count: total, error: e0 } = await supabase
      .from("petition_signatures")
      .select("id", { count: "exact", head: true })
      .eq("verified", true);
    if (e0) throw e0;

    const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [{ count: c24, error: e24 }, { count: c7, error: e7 }] = await Promise.all([
      supabase
        .from("petition_signatures")
        .select("id", { count: "exact", head: true })
        .eq("verified", true)
        .gte("verified_at", since24h),
      supabase
        .from("petition_signatures")
        .select("id", { count: "exact", head: true })
        .eq("verified", true)
        .gte("verified_at", since7d),
    ]);

    if (e24) throw e24;
    if (e7) throw e7;

    const count = total ?? 0;
    const next = pickNextMilestone(count);
    const remaining = Math.max(0, next - count);

    return NextResponse.json(
      {
        count,
        growth_24h: c24 ?? 0,
        growth_7d: c7 ?? 0,
        milestone_next: next,
        milestone_remaining: remaining,
      },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      {
        count: 0,
        growth_24h: 0,
        growth_7d: 0,
        milestone_next: 100,
        milestone_remaining: 100,
      },
      { status: 200 }
    );
  }
}
