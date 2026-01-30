import { getDict } from "@/lib/i18n";

export default function Page({ params }) {
  const dict = getDict(params.locale);
  const data = dict.nexit;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">{data.title}</h1>
      <p className="mt-3 text-slate-700">{data.lead}</p>

      {data.separateBannerTitle ? (
        <div className="mt-8 rounded-3xl border bg-slate-50 p-6">
          <div className="text-base font-semibold">{data.separateBannerTitle}</div>
          <p className="mt-2 text-sm text-slate-700">{data.separateBannerText}</p>
        </div>
      ) : null}

      <div className="mt-10 space-y-10">
        {data.sections?.map((sec, idx) => (
          <section key={idx} className="rounded-3xl border bg-white p-6 shadow-soft">
            <h2 className="text-xl font-bold">{sec.title}</h2>

            {sec.paras ? (
              <div className="mt-3 space-y-3 text-slate-700">
                {sec.paras.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}

            {sec.bullets ? (
              <ul className="mt-4 space-y-3">
                {sec.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-700" />
                    <span className="text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </section>
        ))}
      </div>

      {data.notTitle ? (
        <div className="mt-10 rounded-3xl border bg-slate-50 p-6">
          <div className="text-base font-semibold">{data.notTitle}</div>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            {data.notBullets?.map((b, idx) => (
              <li key={idx}>• {b}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  
      <section className="mt-16 space-y-8">
        <h2 className="text-3xl font-bold">Migratie & nationale grip</h2>
        <p>
          Voor veel burgers draait dit debat om één kernvraag: houden we als land nog zelf de regie? Wanneer instroom
          structureel groter is dan wat huisvesting, zorg, onderwijs en handhaving aankunnen, ontstaat er onvermijdelijk
          druk en onvrede. BurgerEerst vindt dat migratiebeleid uitvoerbaar moet zijn, met duidelijke grenzen en snelle
          procedures.
        </p>
        <p>
          Europese afspraken en juridische kaders beperken regelmatig de ruimte om nationaal beleid aan te scherpen.
          Dat is precies waar de discussie over NEXIT voor velen begint: welke bevoegdheden horen hier te liggen, en welke
          wil je niet langer uitbesteden?
        </p>

        <h3 className="text-2xl font-semibold">Wonen, voorzieningen & draagvlak</h3>
        <p>
          Massale instroom raakt niet alleen cijfers, maar echte levens: wachttijden voor woningen, volle klassen, druk
          op huisartsen en spanningen in wijken waar de draagkracht al beperkt is. Zonder draagvlak is elk migratiesysteem
          instabiel — en dat geldt ook voor solidariteit zelf.
        </p>

        <h3 className="text-2xl font-semibold">Democratisch tekort</h3>
        <p>
          Een veelgehoorde kritiek is dat belangrijke besluiten steeds vaker via complexe Europese trajecten tot stand
          komen, waardoor burgers het gevoel krijgen dat stemmen weinig uitmaakt. BurgerEerst vindt dat democratische
          controle scherper en directer moet: wie beleid maakt, moet ook direct aanspreekbaar zijn door Nederlandse kiezers.
        </p>

        <h3 className="text-2xl font-semibold">Brexit als referentie</h3>
        <p>
          Brexit laat zien dat uitstappen mogelijk is, maar ook dat het proces voorbereiding en realisme vereist.
          Het Verenigd Koninkrijk kreeg meer beleidsruimte terug, maar kende ook een complexe overgangsperiode, nieuwe
          handelsafspraken en politieke verdeeldheid.
        </p>
        <p>
          De les: als je dit pad ooit serieus overweegt, moet het gebaseerd zijn op feiten, scenario’s en een helder plan —
          niet op slogans. Tegelijk laat Brexit zien dat nationale keuzes niet onmogelijk zijn.
        </p>

        <h3 className="text-2xl font-semibold">Economie, handel & zelfbeschikking</h3>
        <p>
          Nederland is een handelsland. Daarom is elke NEXIT-discussie ook een economisch vraagstuk. BurgerEerst vindt dat
          soevereiniteit en democratische controle zwaar moeten wegen, maar dat je eerlijk moet zijn over de trade-offs:
          toegang tot markten, regelgeving en onderhandelingen.
        </p>

        <h3 className="text-2xl font-semibold">Waar het voor ons op neerkomt</h3>
        <p>
          NEXIT is voor BurgerEerst geen doel op zichzelf, maar een manier om de discussie over grenzen, migratie,
          democratische controle en nationale regie scherp te voeren. Wat je ook vindt van de EU: beleid moet uitvoerbaar zijn
          en gedragen worden door de samenleving.
        </p>
      </section>

);
}
