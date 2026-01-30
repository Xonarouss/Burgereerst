"use client";

import { useEffect, useMemo, useState } from "react";
import { t as tt } from "@/lib/i18n";

export default function LiveCountBadge({ locale, dict, compact }) {
  const [count, setCount] = useState(null);
  const t = useMemo(() => (k) => tt(dict, k), [dict]);

  async function load() {
    try {
      const res = await fetch("/api/petition/count", { cache: "no-store" });
      const data = await res.json();
      if (typeof data?.count === "number") setCount(data.count);
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
