import { getDict, t } from "@/lib/i18n";
import PetitionForm from "@/components/PetitionForm";
import CountBadge from "@/components/CountBadge";
import Link from "next/link";

export default async function Home({ params }) {
  const dict = getDict(params.locale);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-slate-700 shadow-soft">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                <span>{t(dict, "site.tagline")}</span>
              </div>

              <h1 className="mt-5 text-4xl font-extrabold tracking-tight sm:text-5xl">
                {t(dict, "home.heroTitle")}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-slate-700">
                {t(dict, "home.heroLead")}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#petitie"
                  className="inline-flex items-center justify-center rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white shadow-soft hover:bg-blue-800"
                >
                  {t(dict, "home.ctaPrimary")}
                </a>
                <Link
                  href={`/${params.locale}/visie`}
                  className="inline-flex items-center justify-center rounded-2xl border px-5 py-3 text-base font-semibold text-slate-900 hover:bg-slate-50"
                >
                  {t(dict, "home.ctaSecondary")}
                </Link>
                <div className="sm:ml-auto">
                  <CountBadge locale={params.locale} dict={dict} />
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-500">
                {t(dict, "home.notBody")}
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative rounded-3xl border bg-white p-6 shadow-soft">
                <div className="flex items-center gap-3">
                  <img
                    src="/brand/mark.png"
                    alt="BurgerEerst"
                    className="h-12 w-auto"
                  />
                  <div>
                    <div className="text-sm font-semibold text-slate-900">
                      {t(dict, "home.formTitle")}
                    </div>
                    <div className="text-sm text-slate-600">
                      {t(dict, "home.formLead")}
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <PetitionForm locale={params.locale} dict={dict} />
                </div>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <span className="font-semibold">{t(dict, "home.notTitle")}:</span>{" "}
                  {t(dict, "home.notBody")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* subtle background */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-red-100 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-blue-100 blur-3xl" />
      </section>

      {/* Pillars */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="flex items-end justify-between gap-6">
          <h2 className="text-2xl font-bold">{t(dict, "home.pillarsTitle")}</h2>
          <CountBadge locale={params.locale} dict={dict} compact />
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dict.home.pillars.map((p, idx) => (
            <div key={idx} className="rounded-3xl border bg-white p-5 shadow-soft">
              <div className="text-base font-semibold">{p.title}</div>
              <p className="mt-2 text-sm text-slate-700">{p.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-7">
            <h3 className="text-xl font-bold">{t(dict, "home.demandsTitle")}</h3>
            <ul className="mt-4 space-y-3">
              {dict.home.demands.map((d, idx) => (
                <li key={idx} className="flex gap-3 rounded-2xl border bg-white p-4">
                  <span className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-700" />
                  <span className="text-slate-800">{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl border bg-slate-50 p-6">
              <div className="text-base font-semibold">{t(dict, "home.notTitle")}</div>
              <p className="mt-2 text-sm text-slate-700">{t(dict, "home.notBody")}</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="rounded-full border bg-white px-3 py-1">Onafhankelijk</span>
                <span className="rounded-full border bg-white px-3 py-1">Transparant</span>
                <span className="rounded-full border bg-white px-3 py-1">Bestaanszekerheid</span>
                <span className="rounded-full border bg-white px-3 py-1">Democratisch draagvlak</span>
              </div>
              <div className="mt-6">
                <Link className="text-sm font-semibold text-blue-700 hover:underline" href={`/${params.locale}/privacy`}>
                  {t(dict, "nav.privacy")}
                </Link>
                <span className="mx-2 text-slate-400">·</span>
                <Link className="text-sm font-semibold text-blue-700 hover:underline" href={`/${params.locale}/disclaimer`}>
                  {t(dict, "nav.disclaimer")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Anchor target for CTA */}
      <div id="petitie" className="scroll-mt-24" />
    </div>
  );
}
