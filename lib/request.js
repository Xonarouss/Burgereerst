export function getClientIp(req) {
  // Works behind reverse proxies (Coolify/Traefik, Cloudflare, etc.)
  const xff = req.headers.get("x-forwarded-for") || "";
  if (xff) {
    // may contain multiple IPs: client, proxy1, proxy2
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }

  const cf = req.headers.get("cf-connecting-ip");
  if (cf) return cf.trim();

  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  // If nothing is present, return null (we will rate limit by user agent only)
  return null;
}

export function getUserAgent(req) {
  return (req.headers.get("user-agent") || "").slice(0, 180);
}
