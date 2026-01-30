export const dynamic = "force-dynamic";

import { getDict } from "@/lib/i18n";
import { notFound } from "next/navigation";

export default function AboutPage({ params }) {
  const locale = params.locale === "en" ? "en" : params.locale === "nl" ? "nl" : null;
  if (!locale) return notFound();
  const dict = getDict(locale);

  const isEN = locale === "en";

  return (
    <main className="mx-auto max-w-6xl px-4 py-14">
      <div className="rounded-3xl border bg-white p-8 shadow-soft">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {isEN ? "About this initiative" : "Over dit initiatief"}
        </h1>

        <p className="mt-4 text-slate-700">
          {isEN ? (
            <>
              BurgerEerst.nl is an independent civic initiative. It is <b>not</b> a political party and it is <b>not</b> affiliated
              with any party. The goal is simple: make real-life consequences visible and bring public pressure back to the places
              where decisions are made.
            </>
          ) : (
            <>
              BurgerEerst.nl is een onafhankelijk burgerinitiatief. Het is <b>geen</b> politieke partij en <b>niet</b> gelieerd aan
              een partij. Het doel is simpel: de echte gevolgen zichtbaar maken en de druk terugbrengen naar de plekken waar besluiten
              worden genomen.
            </>
          )}
        </p>

        <h2 className="mt-10 text-xl font-bold text-slate-900">
          {isEN ? "Why I started this" : "Waarom ik dit ben gestart"}
        </h2>

        <p className="mt-3 text-slate-700">
          {isEN ? (
            <>
              I’m the founder, but I publish under a pseudonym on purpose. Not because I’m “mysterious”, but because privacy matters —
              and because the conversation should be about the issues, not about my private life.
            </>
          ) : (
            <>
              Ik ben de oprichter, maar ik publiceer bewust onder een schuilnaam. Niet omdat ik “mysterieus” wil doen, maar omdat
              privacy telt — en omdat het gesprek over de inhoud moet gaan, niet over mijn privéleven.
            </>
          )}
        </p>

        <p className="mt-3 text-slate-700">
          {isEN ? (
            <>
              I live with health issues that make working (fully) impossible. For most people in this situation, that is already a
              punishment by itself: you lose routine, opportunities, and often part of your social life. An income cut on top of that
              doesn’t “motivate” anyone — it pushes people further into stress and insecurity.
            </>
          ) : (
            <>
              Ik leef met gezondheidsproblemen waardoor (volledig) werken niet lukt. Voor de meeste mensen in die situatie is dat al
              een straf op zichzelf: je verliest ritme, kansen en vaak ook een stuk sociaal leven. Een extra inkomensklap daarbovenop
              “motiveert” niemand — het duwt mensen verder de stress en onzekerheid in.
            </>
          )}
        </p>

        <h2 className="mt-10 text-xl font-bold text-slate-900">
          {isEN ? "What I hope to achieve" : "Wat ik wil bereiken"}
        </h2>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-700">
          <li>{isEN ? "A clear signal: stop policies that hit the weakest first." : "Een duidelijk signaal: stop beleid dat de zwaksten als eerste raakt."}</li>
          <li>{isEN ? "Political accountability: explain choices, publish impact, and adjust course." : "Politieke verantwoording: leg keuzes uit, publiceer impact en stuur bij."}</li>
          <li>{isEN ? "A broader public debate about costs, housing pressure, and migration policy — without dehumanizing people." : "Een breder debat over kosten, woningdruk en migratiebeleid — zonder mensen te ontmenselijken."}</li>
          <li>{isEN ? "More signatures = more pressure. That is why this petition exists." : "Meer handtekeningen = meer druk. Daarom bestaat deze petitie."}</li>
        </ul>

        <div className="mt-10 rounded-2xl border bg-slate-50 p-5 text-sm text-slate-700">
          {isEN ? (
            <>
              <b>Note:</b> The NEXIT page is a separate opinion page and is <b>not</b> part of the petition itself.
            </>
          ) : (
            <>
              <b>Let op:</b> de NEXIT-pagina is een aparte standpunt-pagina en valt <b>niet</b> onder de petitie zelf.
            </>
          )}
        </div>
      </div>
    </main>
  );
}
