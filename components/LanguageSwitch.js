import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LanguageSwitch({ locale }) {
  // This is a server component by default; keep it simple with normal links.
  const other = locale === "nl" ? "en" : "nl";

  return (
    <div className="inline-flex items-center rounded-2xl border bg-white p-1 shadow-soft">
      <Link
        href={`/${locale}`}
        className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${locale === "nl" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
      >
        NL
      </Link>
      <Link
        href={`/${other}`}
        className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${locale === "en" ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-50"}`}
      >
        EN
      </Link>
    </div>
  );
}
