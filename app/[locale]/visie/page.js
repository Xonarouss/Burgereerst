import { getDict, t } from "@/lib/i18n";

export default function Vision({ params }) {
  const dict = getDict(params.locale);
  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold">{t(dict, "vision.title")}</h1>
      <p className="mt-3 text-lg text-slate-700">{t(dict, "vision.lead")}</p>

      <div className="mt-10 space-y-6">
        {dict.vision.sections.map((s, idx) => (
          <section key={idx} className="rounded-3xl border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="mt-2 text-slate-700">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
