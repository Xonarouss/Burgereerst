import { getDict, t } from "@/lib/i18n";

export default function Disclaimer({ params }) {
  const dict = getDict(params.locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t(dict, "disclaimer.title")}</h1>
      <div className="mt-6 space-y-3 text-slate-700">
        {dict.disclaimer.body.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border bg-slate-50 p-6">
        <h2 className="text-lg font-bold">{params.locale === "en" ? "No affiliation" : "Geen affiliatie"}</h2>
        <p className="mt-2 text-sm text-slate-700">
          {params.locale === "en"
            ? "BurgerEerst.nl is a civic initiative. We do not represent a political party, and parties may not claim endorsement based on this website."
            : "BurgerEerst.nl is een burgerinitiatief. We vertegenwoordigen geen politieke partij, en partijen mogen geen steun claimen op basis van deze website."}
        </p>
      </div>
    </div>
  );
}
