import { getDict, t } from "@/lib/i18n";

export default function Privacy({ params }) {
  const dict = getDict(params.locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t(dict, "privacy.title")}</h1>
      <div className="mt-6 space-y-3 text-slate-700">
        {dict.privacy.body.map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold">
          {params.locale === "en" ? "Your rights" : "Jouw rechten"}
        </h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-700">
          <li>{params.locale === "en" ? "Request access or deletion of your data." : "Vraag inzage of verwijdering van je gegevens."}</li>
          <li>{params.locale === "en" ? "We keep data only as long as needed for the petition’s purpose." : "We bewaren gegevens niet langer dan nodig voor het doel van de petitie."}</li>
          <li>{params.locale === "en" ? "We use confirmation emails to prevent abuse." : "We gebruiken bevestigingsmails om misbruik te voorkomen."}</li>
        </ul>
      </div>
    </div>
  );
}
