import { t } from "@/lib/i18n";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

async function getSignatureCount() {
  try {
    const supabase = getSupabaseAdmin();
    const { count, error } = await supabase
      .from("petition_signatures")
      .select("*", { count: "exact", head: true });
    if (error) return null;
    return count ?? 0;
  } catch {
    return null;
  }
}

export default async function CountBadge({ locale, dict, compact }) {
  const count = await getSignatureCount();
  const label = t(dict, "home.countLabel");

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-2xl border bg-white px-3 py-2 shadow-soft ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <span className="h-2 w-2 rounded-full bg-emerald-600" />
      <span className="font-semibold text-slate-900">{label}:</span>
      <span className="font-extrabold">
        {count === null ? "—" : new Intl.NumberFormat(locale).format(count)}
      </span>
    </div>
  );
}
