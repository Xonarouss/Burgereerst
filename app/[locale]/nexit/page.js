
export default function NexitPage({ params }) {
  const locale = params?.locale || "nl";

  const NL = (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-bold">NEXIT – Kritische Analyse</h1>
      <p>
        De Europese Unie heeft Nederland veel gebracht, maar ook veel gekost. Steeds meer beleid
        wordt bepaald buiten nationale democratische controle.
      </p>

      <h2 className="text-2xl font-semibold">Migratie</h2>
      <p>
        EU-verdragen beperken nationale grip op migratie. Massale instroom zonder draagvlak
        heeft grote gevolgen voor wonen, zorg en veiligheid.
      </p>

      <h2 className="text-2xl font-semibold">Vergelijking met Brexit</h2>
      <p>
        Brexit liet zien dat nationale keuzes weer mogelijk zijn buiten de EU.
        Hoewel de uitvoering complex was, herwon het VK controle over migratie en wetgeving.
      </p>

      <h2 className="text-2xl font-semibold">Democratisch tekort</h2>
      <p>
        Ongekozen instituties bepalen steeds vaker beleid. Nationale parlementen verliezen invloed.
      </p>

      <h2 className="text-2xl font-semibold">Economische afweging</h2>
      <p>
        Nexit vraagt om een zorgvuldige afweging. Handelsrelaties blijven essentieel,
        maar met hernieuwde nationale soevereiniteit.
      </p>
    </main>
  );

  const EN = (
    <main className="max-w-4xl mx-auto px-6 py-16 space-y-8">
      <h1 className="text-4xl font-bold">NEXIT – Critical Perspective</h1>
      <p>
        The European Union has benefited the Netherlands, but at significant cost.
        Increasingly, policies are decided outside national democratic control.
      </p>

      <h2 className="text-2xl font-semibold">Migration</h2>
      <p>
        EU frameworks limit national control over migration. Large-scale immigration without support
        impacts housing, healthcare and safety.
      </p>

      <h2 className="text-2xl font-semibold">Comparison with Brexit</h2>
      <p>
        Brexit demonstrated the possibility of regaining national control.
        Despite challenges, the UK reclaimed authority over migration and law.
      </p>

      <h2 className="text-2xl font-semibold">Democratic Deficit</h2>
      <p>
        Unelected institutions increasingly shape policy, reducing parliamentary influence.
      </p>

      <h2 className="text-2xl font-semibold">Economic Considerations</h2>
      <p>
        Nexit requires careful evaluation. Trade remains vital, but with restored sovereignty.
      </p>
    </main>
  );

  return locale === "en" ? EN : NL;
}
