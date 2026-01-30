import { getDict, t } from "@/lib/i18n";

export default function Contact({ params }) {
  const dict = getDict(params.locale);
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contact@burgereerst.nl";
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t(dict, "contact.title")}</h1>
      <p className="mt-4 text-slate-700">{t(dict, "contact.body")}</p>
      <a className="mt-2 inline-flex rounded-2xl border bg-white px-4 py-2 font-semibold text-blue-700 shadow-soft hover:bg-slate-50" href={`mailto:${email}`}>
        {email}
      </a>

      <div className="mt-10 rounded-3xl border bg-white p-6 shadow-soft">
        <h2 className="text-lg font-bold">{params.locale === "en" ? "Data deletion" : "Gegevens verwijderen"}</h2>
        <p className="mt-2 text-slate-700">
          {params.locale === "en"
            ? "If you want your signature removed, email us from the same address you used to sign and include your city."
            : "Wil je je handtekening laten verwijderen? Mail ons vanaf hetzelfde e-mailadres waarmee je tekende en vermeld je woonplaats."}
        </p>
      </div>
    </div>
  );
}
