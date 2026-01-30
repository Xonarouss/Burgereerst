"use client";

import { useMemo, useState } from "react";
import { t as tt } from "@/lib/i18n";

export default function PetitionForm({ locale, dict }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | already
  const [form, setForm] = useState({ full_name: "", city: "", email: "", consent: false, website: "" }); // website = honeypot
  const t = useMemo(() => (k) => tt(dict, k), [dict]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          full_name: form.full_name,
          city: form.city,
          email: form.email,
          consent_privacy: form.consent,
          website: form.website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (data?.code === "ALREADY") {
        setStatus("already");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      {/* honeypot */}
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        value={form.website}
        onChange={(e) => setForm((s) => ({ ...s, website: e.target.value }))}
        placeholder="Website"
        name="website"
      />

      <Field label={t("form.name")}>
        <input
          className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          value={form.full_name}
          onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
          required
          minLength={2}
        />
      </Field>

      <Field label={t("form.city")}>
        <input
          className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          value={form.city}
          onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
          required
          minLength={2}
        />
      </Field>

      <Field label={t("form.email")}>
        <input
          type="email"
          className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
          value={form.email}
          onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
          required
        />
      </Field>

      <label className="flex gap-3 rounded-2xl border bg-slate-50 p-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={form.consent}
          onChange={(e) => setForm((s) => ({ ...s, consent: e.target.checked }))}
          required
        />
        <span>{t("form.consent")}</span>
      </label>

      <button
        type="submit"
        disabled={status === "loading"}
        className="w-full rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white shadow-soft hover:bg-blue-800 disabled:opacity-60"
      >
        {status === "loading" ? t("form.submitting") : t("form.submit")}
      </button>

      {status === "success" && <Notice tone="ok">{t("form.success")}</Notice>}
      {status === "already" && <Notice tone="warn">{t("form.already")}</Notice>}
      {status === "error" && <Notice tone="bad">{t("form.error")}</Notice>}
    </form>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="mb-1 text-sm font-semibold text-slate-700">{label}</div>
      {children}
    </div>
  );
}

function Notice({ tone, children }) {
  const cls =
    tone === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : tone === "warn"
      ? "border-amber-200 bg-amber-50 text-amber-900"
      : "border-red-200 bg-red-50 text-red-900";
  return <div className={`rounded-2xl border p-3 text-sm ${cls}`}>{children}</div>;
}
