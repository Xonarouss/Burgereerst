import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import { sha256, hashIp } from "@/lib/crypto";
import { getClientIp, getUserAgent } from "@/lib/request";

function nowIso() {
  return new Date().toISOString();
}

function addSeconds(date, seconds) {
  return new Date(date.getTime() + seconds * 1000);
}

export async function enforceRateLimit(req, {
  action,
  limit,
  windowSec,
  blockSec = 0,
}) {
  const supabase = getSupabaseAdmin();

  const ip = getClientIp(req);
  const ipHash = hashIp(ip);
  const ua = getUserAgent(req);
  const uaHash = ua ? sha256(ua) : "";

  // Key is salted by action so different endpoints don't affect each other.
  const key = sha256(`${action}:${ipHash || "noip"}:${uaHash || "noua"}`);

  const now = new Date();
  const windowStartCutoff = new Date(now.getTime() - windowSec * 1000);

  // Read current row
  const { data: row, error } = await supabase
    .from("rate_limits")
    .select("key, window_start, count, blocked_until")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    // Fail-open: don't block legitimate traffic if DB is misconfigured.
    return { ok: true, key, failOpen: true };
  }

  if (row?.blocked_until) {
    const bu = new Date(row.blocked_until);
    if (bu > now) {
      return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bu - now) / 1000)) };
    }
  }

  let count = row?.count || 0;
  let window_start = row?.window_start ? new Date(row.window_start) : null;

  if (!window_start || window_start < windowStartCutoff) {
    // new window
    count = 1;
    window_start = now;
  } else {
    count += 1;
  }

  let blocked_until = null;
  if (count > limit) {
    blocked_until = blockSec > 0 ? addSeconds(now, blockSec).toISOString() : addSeconds(now, windowSec).toISOString();
  }

  await supabase
    .from("rate_limits")
    .upsert(
      {
        key,
        window_start: window_start.toISOString(),
        count,
        blocked_until,
        updated_at: nowIso(),
      },
      { onConflict: "key" }
    );

  if (blocked_until) {
    const bu = new Date(blocked_until);
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((bu - now) / 1000)) };
  }

  return { ok: true };
}
