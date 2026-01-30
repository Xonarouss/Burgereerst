import Link from "next/link";
import { t } from "@/lib/i18n";

export default function Footer({ locale, dict }) {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <img src="/brand/logo-full.png" alt="BurgerEerst" className="h-12 w-auto" />
            <p className="mt-3 text-sm text-slate-600">
              {t(dict, "site.metaDescription")}
            </p>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900">Pages</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}`}>{t(dict, "nav.petition")}</Link></li>
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}/visie`}>{t(dict, "nav.vision")}</Link></li>
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}/nexit`}>{t(dict, "nav.nexit")}</Link></li>
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}/over-ons`}>{t(dict, "nav.about")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900">Legal</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}/privacy`}>{t(dict, "nav.privacy")}</Link></li>
              <li><Link className="text-slate-700 hover:underline" href={`/${locale}/disclaimer`}>{t(dict, "nav.disclaimer")}</Link></li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-bold text-slate-900">{t(dict, "nav.contact")}</div>
            <p className="mt-3 text-sm text-slate-700">
              <Link className="font-semibold text-blue-700 hover:underline" href={`/${locale}/contact`}>
                {t(dict, "nav.contact")}
              </Link>
            </p>
</div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} BurgerEerst.nl</div>
          <div>
            {locale === "en"
              ? "Independent civic initiative — not affiliated with any political party."
              : "Onafhankelijk burgerinitiatief — niet gelieerd aan een politieke partij."}
          </div>
        </div>
      </div>
    </footer>
  );
}

