// Helpers to construct absolute URLs reliably behind proxies / container hosts.
// In production we want to avoid accidental localhost links in emails.

export function getConfiguredSiteUrl() {
  const envUrl =
    process.env.BLOG_BASE_URL ||
    process.env.SITE_URL ||
    process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    return envUrl.trim().replace(/\/$/, "");
  }
  return null;
}

export function getBaseUrl(req) {
  // Prefer explicit settings first.
  const configured = getConfiguredSiteUrl();
  if (configured) return configured;

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
