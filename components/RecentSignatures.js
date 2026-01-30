"use client";

import { useEffect, useMemo, useState } from "react";
import { t as tt } from "@/lib/i18n";

function fmtDateTime(iso, locale) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat(locale, { dateStyle: "short", timeStyle: "short" }).format(d);
  } catch {
    return "";
  }
}

export default function RecentSignatures({ locale, dict, limit = 5 }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const t = useMemo(() => (k) => tt(dict, k), [dict]);

  async function load() {
    try {
      const res = await fetch(`/api/petition/recent?limit=${limit}`, { cache: "no-store" });
      const data = await res.json();
      if (Array.isArray(data?.items)) setItems(data.items);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  return (
    <div className="mt-10 rounded-3xl border bg-white p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <div className="text-sm font-semibold text-slate-900">{t("home.recentTitle")}</div>
          <div className="mt-1 text-sm text-slate-600">{t("home.recentLead")}</div>
        </div>
        <button
          type="button"
          onClick={load}
          className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
        >
          {t("common.refresh")}
        </button>
      </div>

      <div className="mt-4">
        {loading && items.length === 0 ? (
          <div className="text-sm text-slate-500">{t("home.recentLoading")}</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-slate-500">{t("home.recentEmpty")}</div>
        ) : (
          <ul className="divide-y">
            {items.map((it) => (
              <li key={it.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-sm font-semibold text-slate-900">
                  {it.city ? `${it.city} — ` : ""}{it.full_name || t("common.anonymous")}
                </div>
                <div className="text-xs text-slate-500">{fmtDateTime(it.created_at, locale)}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3 text-xs text-slate-500">{t("home.recentNote")}</div>
    </div>
  );
}
