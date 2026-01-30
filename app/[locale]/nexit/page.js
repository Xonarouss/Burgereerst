import { getDict, t } from "@/lib/i18n";

export default function Nexit({ params }) {
  const dict = getDict(params.locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <div className="inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1 text-sm text-slate-700 shadow-soft">
        <span className="h-2 w-2 rounded-full bg-red-600" />
        <span>{t(dict, "nexit.lead")}</span>
      </div>

      <h1 className="mt-4 text-3xl font-extrabold">{t(dict, "nexit.title")}</h1>

      <div className="mt-8 space-y-4">
        {dict.nexit.body.map((p, idx) => (
          <p key={idx} className="text-slate-700">
            {p}
          </p>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border bg-slate-50 p-6">
        <h2 className="text-lg font-bold">Belangrijk</h2>
        <p className="mt-2 text-sm text-slate-700">
          {params.locale === "en"
            ? "This page is informational. The petition is about the cabinet’s current direction and cost/benefit policies."
            : "Deze pagina is informatief. De petitie gaat over de huidige koers van het kabinet en het beleid rond kosten/uitkeringen."}
        </p>
      </div>
    </div>
  );
}
