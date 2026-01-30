"use client";

import { useMemo, useState } from "react";
import { t as tt } from "@/lib/i18n";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

function ShareLinks({ locale }) {
  const url = (process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl") + `/${locale}`;
  const text =
    locale === "en" ? "Sign the petition on BurgerEerst.nl" : "Teken de petitie op BurgerEerst.nl";

  const twitter = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(
    url
  )}`;
  const wa = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
  const discord = url; // Discord uses OG tags; just share the URL

  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-slate-700">{locale === "en" ? "Share this petition" : "Deel deze petitie"}</div>
      <div className="mt-2 flex flex-wrap gap-2">
        <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
        <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={twitter} target="_blank" rel="noreferrer">X/Twitter</a>
        <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={discord} target="_blank" rel="noreferrer">Discord</a>
      </div>
    </div>
  );
}

export default function PetitionForm({ locale, dict }) {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error | already
  const [form, setForm] = useState({
    anonymous: false,
    full_name: "",
    city: "",
    email: "",
    consent: false,
    website: "", // website = honeypot
  });

  const t = useMemo(() => (k) => tt(dict, k), [dict]);

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("loading");

    try {
      let recaptchaToken = null;
      if (SITE_KEY && typeof window !== "undefined" && window.grecaptcha?.execute) {
        recaptchaToken = await window.grecaptcha.execute(SITE_KEY, { action: "petition" });
      }

      const res = await fetch("/api/petition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          anonymous: form.anonymous,
          full_name: form.anonymous ? "" : form.full_name,
          city: form.anonymous ? "" : form.city,
          email: form.email,
          consent_privacy: form.consent,
          recaptcha_token: recaptchaToken,
          website: form.website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus("success");
        return;
      }
      if (data?.code === "ALREADY" || data?.code === "ALREADY_VERIFIED") {
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

      <label className="flex gap-3 rounded-2xl border bg-white p-3 text-sm text-slate-700">
        <input
          type="checkbox"
          className="mt-1"
          checked={form.anonymous}
          onChange={(e) => setForm((s) => ({ ...s, anonymous: e.target.checked }))}
        />
        <span>{t("form.anonymous")}</span>
      </label>

      {!form.anonymous && (
        <>
          <Field label={t("form.name")}>
            <input
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              value={form.full_name}
              onChange={(e) => setForm((s) => ({ ...s, full_name: e.target.value }))}
              required={!form.anonymous}
              minLength={2}
            />
          </Field>

          <Field label={t("form.city")}>
            <input
              className="w-full rounded-2xl border px-4 py-3 outline-none focus:ring-2 focus:ring-blue-200"
              value={form.city}
              onChange={(e) => setForm((s) => ({ ...s, city: e.target.value }))}
              required={!form.anonymous}
              minLength={2}
            />
          </Field>
        </>
      )}

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

      <ShareLinks locale={locale} />

      <p className="mt-3 text-xs text-slate-500">
        {t("form.recaptchaNote")}{" "}
        <a className="underline" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
          Privacy
        </a>
        {" • "}
        <a className="underline" href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
          Terms
        </a>
      </p>

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
