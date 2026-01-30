import { t } from "@/lib/i18n";

async function getCount() {
  try {
    const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const res = await fetch(`${base}/api/petition/count`, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.count ?? null;
  } catch {
    return null;
  }
}

export default async function CountBadge({ locale, dict, compact }) {
  const count = await getCount();
  const label = t(dict, "home.countLabel");
  return (
    <div className={`inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-soft ${compact ? "text-xs" : "text-sm"}`}>
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
      <span className="font-semibold text-slate-900">{label}:</span>
      <span className="font-extrabold">{count === null ? "—" : new Intl.NumberFormat(locale).format(count)}</span>
    </div>
  );
}
