import webpush from "web-push";

let configured = false;

function ensureConfigured() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject =
    process.env.VAPID_SUBJECT ||
    process.env.BLOG_BASE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://burgereerst.nl";
  if (!publicKey || !privateKey) return { ok: false, reason: "missing_vapid_keys" };

  if (!configured) {
    webpush.setVapidDetails(subject, publicKey, privateKey);
    configured = true;
  }
  return { ok: true };
}

export async function sendPush({ subscription, payload }) {
  const cfg = ensureConfigured();
  if (!cfg.ok) return { ok: false, error: cfg.reason };

  try {
    await webpush.sendNotification(subscription, JSON.stringify(payload));
    return { ok: true };
  } catch (e) {
    // web-push throws on gone/invalid endpoints (410, 404)
    return { ok: false, error: e?.statusCode ? `HTTP ${e.statusCode}` : (e?.message || "push_failed"), statusCode: e?.statusCode };
  }
}
