import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { enforceRateLimit } from "@/lib/rateLimit";
import { sha256 } from "@/lib/crypto";

const Body = z.object({
  locale: z.enum(["nl", "en"]).default("nl"),
  subscription: z.any(),
});

export async function POST(req) {
  const rl = await enforceRateLimit(req, { action: "blog_subscribe_push", limit: 30, windowSec: 3600, blockSec: 3600 });
  if (!rl.ok) return NextResponse.json({ error: "rate_limited", retry_after: rl.retryAfterSec }, { status: 429 });

  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const { locale, subscription } = parsed.data;
  const endpoint = subscription?.endpoint;
  if (!endpoint) return NextResponse.json({ error: "missing_endpoint" }, { status: 400 });

  const endpointHash = sha256(String(endpoint));

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("blog_push_subscriptions").upsert(
    {
      endpoint_hash: endpointHash,
      endpoint,
      locale,
      subscription,
      active: true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "endpoint_hash" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
