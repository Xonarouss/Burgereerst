import { getDict } from "@/lib/i18n";
import Image from "next/image";

export default function Page({ params }) {
  const dict = getDict(params.locale);
  const data = dict.vision;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight">{data.title}</h1>
      <p className="mt-3 text-slate-700">{data.lead}</p>

      {/* Video: modern, responsive player */}
      <div className="mt-8 overflow-hidden rounded-3xl border bg-slate-900 shadow-soft">
        <div className="relative aspect-video w-full">
          <video
            className="h-full w-full"
            controls
            playsInline
            preload="metadata"
            poster="/promo/Promo-2.png"
          >
            <source src="/media/IntroVideo.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="border-t border-white/10 bg-slate-950/40 px-4 py-3 text-sm text-white/80">
          {params.locale === "en"
            ? "Short intro video about the campaign and why this petition exists."
            : "Korte introvideo over de campagne en waarom deze petitie er is."}
        </div>
      </div>

      {/* Poster / flyer image */}
      <div className="mt-6 overflow-hidden rounded-3xl border bg-white shadow-soft">
        <div className="relative w-full">
          <Image
            src="/promo/Promo-2.png"
            alt={params.locale === "en" ? "Campaign flyer" : "Campagne-afbeelding"}
            width={1200}
            height={1800}
            className="h-auto w-full"
            priority
          />
        </div>
      </div>

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
  );
}


{/* Uitgebreide Visie – toevoegingen */}
<section className="mt-16 space-y-8">
  <h2 className="text-3xl font-bold">Wonen, studenten & betaalbaarheid</h2>
  <p>
    De woningmarkt is volledig vastgelopen. Huizenprijzen zijn geëxplodeerd, huren zijn
    onbetaalbaar geworden en studenten betalen absurde bedragen voor kleine kamers.
    Huisvesting is geen luxeproduct, maar een basisbehoefte.
  </p>
  <p>
    BurgerEerst staat voor grootschalige woningbouw, het doorbreken van blokkades,
    en het hard aanpakken van huisjesmelkers en speculatie.
  </p>

  <h2 className="text-3xl font-bold">Migratie & draagvlak</h2>
  <p>
    Massale immigratie zonder draagvlak legt directe druk op wonen, zorg, onderwijs
    en sociale samenhang. Menselijkheid vereist duidelijke grenzen en uitvoerbaar beleid.
  </p>

  <h2 className="text-3xl font-bold">Stikstof & realisme</h2>
  <p>
    Het stikstofbeleid is doorgeslagen in technocratie. Modellen zijn belangrijk,
    maar mogen nooit belangrijker zijn dan mensen, woningen en bestaanszekerheid.
  </p>

  <h2 className="text-3xl font-bold">Zorg, arbeid en veiligheid</h2>
  <p>
    Zorg en arbeidssystemen staan onder zware druk. Eerst zorgen voor wie hier al woont,
    eerlijke lonen beschermen en handhaving serieus nemen zijn voorwaarden voor draagvlak.
  </p>

  <h2 className="text-3xl font-bold">Luchtvaart & economie</h2>
  <p>
    De luchtvaartsector is een essentiële pijler van de Nederlandse economie.
    Schiphol moet kunnen groeien, Lelystad Airport moet open voor burgerluchtvaart.
    Indien nodig moet uitbreiding creatief worden opgelost, bijvoorbeeld via
    een luchthaven op de Noordzee om ruimte te creëren voor woningbouw.
  </p>
</section>
