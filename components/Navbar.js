import Link from "next/link";
import LanguageSwitch from "./LanguageSwitch";
import { t } from "@/lib/i18n";

export default function Navbar({ locale, dict }) {
  const nav = [
    { href: `/${locale}`, label: t(dict, "nav.petition") },
    { href: `/${locale}/visie`, label: t(dict, "nav.vision") },
    { href: `/${locale}/nexit`, label: t(dict, "nav.nexit") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href={`/${locale}`} className="flex items-center gap-3">
          <img src="/brand/mark.png" alt="BurgerEerst" className="h-9 w-auto" />
          <div className="hidden sm:block">
            <div className="text-sm font-extrabold leading-none text-slate-900">
              BurgerEerst
            </div>
            <div className="text-xs text-slate-600">{t(dict, "site.tagline")}</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm font-semibold text-slate-700 hover:text-slate-900">
              {i.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`/${locale}#petitie`}
            className="hidden rounded-2xl bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-soft hover:bg-blue-800 sm:inline-flex"
          >
            {t(dict, "home.ctaPrimary")}
          </a>
          <LanguageSwitch locale={locale} />
        </div>
      </div>

      {/* mobile nav */}
      <div className="border-t md:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-2">
          {nav.map((i) => (
            <Link key={i.href} href={i.href} className="text-sm font-semibold text-slate-700">
              {i.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
