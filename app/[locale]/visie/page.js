
export default function VisiePage({ params }) {
  const locale = params?.locale || "nl";

  const NL = (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Onze Visie – Burger Eerst, Altijd</h1>
      <p>
        Nederland is een rijk en veilig land, opgebouwd door generaties burgers die hebben gewerkt,
        gezorgd, ondernomen en verantwoordelijkheid hebben genomen. Toch ervaren steeds meer Nederlanders
        dat het beleid van vandaag niet meer in hun voordeel werkt.
      </p>
      <p className="font-semibold">
        BurgerEerst is ontstaan vanuit één fundamentele overtuiging: de overheid bestaat om de burger te dienen — niet omgekeerd.
      </p>

      <h2 className="text-2xl font-semibold">Bestaanszekerheid</h2>
      <p>
        Bestaanszekerheid vormt het fundament van een stabiele samenleving. Wonen, energie, zorg en boodschappen
        moeten betaalbaar zijn. Vandaag zien we torenhoge lasten en structurele onzekerheid.
      </p>

      <h2 className="text-2xl font-semibold">Wonen & Huisvesting</h2>
      <p>
        De woningmarkt is ontspoord. Huizen en studentenkamers zijn onbetaalbaar geworden,
        terwijl huisjesmelkers buitensporige winsten maken. BurgerEerst staat voor grootschalige woningbouw,
        het terugdringen van speculatie en het aanpakken van misstanden in de verhuurmarkt.
      </p>

      <h2 className="text-2xl font-semibold">Migratie</h2>
      <p>
        Migratie moet beheersbaar zijn. Massale instroom zonder draagvlak legt druk op wonen, zorg en sociale samenhang.
        Menselijkheid betekent duidelijke grenzen en eerlijke procedures.
      </p>

      <h2 className="text-2xl font-semibold">Stikstof & Milieu</h2>
      <p>
        Natuur beschermen is belangrijk, maar beleid moet realistisch zijn. Het huidige stikstofbeleid
        is doorgeschoten en blokkeert woningbouw en economische ontwikkeling.
      </p>

      <h2 className="text-2xl font-semibold">Zorg</h2>
      <p>
        De zorg staat onder druk. Vergrijzing en personeelstekorten vragen om keuzes.
        Eerst zorgen voor wie hier al woont.
      </p>

      <h2 className="text-2xl font-semibold">Arbeid</h2>
      <p>
        Wie werkt moet kunnen leven. Oneerlijke concurrentie en schijnconstructies ondermijnen lonen
        en arbeidsvoorwaarden.
      </p>

      <h2 className="text-2xl font-semibold">Veiligheid & Handhaving</h2>
      <p>
        Regels gelden voor iedereen. Zonder handhaving verdwijnt draagvlak en vertrouwen.
      </p>

      <h2 className="text-2xl font-semibold">Luchtvaart</h2>
      <p>
        De luchtvaart is een essentiële economische pijler. Schiphol moet kunnen groeien,
        Lelystad Airport moet open voor burgerluchtvaart. Indien nodig kan uitbreiding plaatsvinden
        via innovatieve oplossingen, zoals een luchthaven op de Noordzee, om ruimte te creëren voor woningen.
      </p>

      <h2 className="text-2xl font-semibold">Soevereiniteit & Democratie</h2>
      <p>
        Nederland moet zelf kunnen beslissen over cruciale thema’s. De burger is geen toeschouwer, maar de opdrachtgever.
      </p>

      <h2 className="text-2xl font-semibold">Toekomst</h2>
      <p>
        We bouwen aan een stabiel land voor volgende generaties. Niet morgen. Nu.
      </p>
    </main>
  );

  const EN = (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-bold">Our Vision – Citizens First, Always</h1>
      <p>
        The Netherlands is a prosperous and safe country, built by generations of citizens who worked,
        cared, invested and took responsibility. Yet many people feel current policies no longer work in their favor.
      </p>
      <p className="font-semibold">
        BurgerEerst is based on one fundamental principle: government exists to serve its citizens — not the other way around.
      </p>

      <h2 className="text-2xl font-semibold">Security of Living</h2>
      <p>
        Affordable housing, energy, healthcare and daily necessities are the foundation of a stable society.
        Today, costs are excessive and certainty is lacking.
      </p>

      <h2 className="text-2xl font-semibold">Housing</h2>
      <p>
        The housing market is broken. Homes and student rooms are unaffordable, while speculative landlords profit.
        We support large-scale construction and firm action against exploitation.
      </p>

      <h2 className="text-2xl font-semibold">Migration</h2>
      <p>
        Migration must be manageable. Mass immigration without public support strains housing,
        healthcare and social cohesion.
      </p>

      <h2 className="text-2xl font-semibold">Nitrogen & Environment</h2>
      <p>
        Environmental protection matters, but policy must be realistic. Current nitrogen rules
        excessively block construction and growth.
      </p>

      <h2 className="text-2xl font-semibold">Healthcare</h2>
      <p>
        Healthcare systems are under pressure. Capacity must match responsibility — caring first for current residents.
      </p>

      <h2 className="text-2xl font-semibold">Labor</h2>
      <p>
        Work should provide a decent living. Unfair competition undermines wages and standards.
      </p>

      <h2 className="text-2xl font-semibold">Safety & Enforcement</h2>
      <p>
        Rules apply to everyone. Without enforcement, trust collapses.
      </p>

      <h2 className="text-2xl font-semibold">Aviation</h2>
      <p>
        Aviation is a key economic sector. Schiphol should grow, Lelystad Airport should open for civil aviation.
        Innovative expansion, including offshore solutions, must be considered.
      </p>

      <h2 className="text-2xl font-semibold">Sovereignty & Democracy</h2>
      <p>
        The Netherlands must retain control over vital decisions. Citizens are the mandate.
      </p>

      <h2 className="text-2xl font-semibold">The Future</h2>
      <p>
        We choose stability and responsibility for future generations. Now.
      </p>
    </main>
  );

  return locale === "en" ? EN : NL;
}
