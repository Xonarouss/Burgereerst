"use client";

import { useEffect, useMemo, useState } from "react";
import { t as tt } from "@/lib/i18n";

export default function LiveCountBadge({ locale, dict, compact }) {
  const [stats, setStats] = useState(null);
  const t = useMemo(() => (k) => tt(dict, k), [dict]);

  async function load() {
    try {
      const res = await fetch("/api/petition/count", { cache: "no-store" });
      const data = await res.json();
      if (typeof data?.count === "number") setStats(data);
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const label = t("home.countLabel");

  const count = stats?.count;
  const growth24 = stats?.growth_24h;
  const next = stats?.milestone_next;
  const remaining = stats?.milestone_remaining;

  return (
    <div
      className={`inline-flex flex-col gap-1 rounded-2xl border bg-white px-3 py-2 shadow-soft ${
        compact ? "text-xs" : "text-sm"
      }`}
    >
      <div className="inline-flex items-center gap-2">
        <span className="h-2 w-2 rounded-full bg-emerald-600" />
        <span className="font-semibold text-slate-900">{label}:</span>
        <span className="font-extrabold">
          {typeof count !== "number" ? "—" : new Intl.NumberFormat(locale).format(count)}
        </span>
        {typeof growth24 === "number" && growth24 > 0 ? (
          <span className="ml-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-extrabold text-emerald-900">
            {(() => {
              const f = new Intl.NumberFormat(locale).format(growth24);
              return locale === "nl" ? `+${f} in de laatste 24 uur` : `+${f} in the last 24h`;
            })()}
          </span>
        ) : null}
      </div>

      {!compact && typeof next === "number" && typeof remaining === "number" ? (
        <div className="text-xs text-slate-600">
          Volgende doel: <span className="font-bold text-slate-900">{new Intl.NumberFormat(locale).format(next)}</span>
          {remaining > 0 ? (
            <span>
              {" "}({new Intl.NumberFormat(locale).format(remaining)} te gaan)
            </span>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
