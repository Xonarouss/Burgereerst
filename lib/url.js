// Small helper to construct absolute URLs reliably behind proxies / container hosts.
export function getBaseUrl(req) {
  // Prefer explicit server-side setting (avoid NEXT_PUBLIC_* overriding by accident).
  const envUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.replace(/\/$/, "");
  }

  // Fallback: infer from request headers (works behind reverse proxies)
  const proto =
    req?.headers?.get("x-forwarded-proto") ||
    (process.env.NODE_ENV === "development" ? "http" : "https");

  const host =
    req?.headers?.get("x-forwarded-host") ||
    req?.headers?.get("host") ||
    "burgereerst.nl";

  return `${proto}://${host}`.replace(/\/$/, "");
}
