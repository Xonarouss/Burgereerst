"use client";

import { useSearchParams } from "next/navigation";

function enc(v) {
  return encodeURIComponent(v || "");
}

function ShareRow({ locale }) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl";
  const url = `${base.replace(/\/$/, "")}/${locale}`;
  const text = locale === "en"
    ? "I signed the BurgerEerst.nl petition. Join me"
    : "Ik heb de BurgerEerst.nl petitie getekend. Doe ook mee";

  const wa = `https://wa.me/?text=${enc(text + "\n" + url)}`;
  const twitter = `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`;
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={wa} target="_blank" rel="noreferrer">WhatsApp</a>
      <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={twitter} target="_blank" rel="noreferrer">X/Twitter</a>
      <a className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50" href={fb} target="_blank" rel="noreferrer">Facebook</a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            alert(locale === "en" ? "Link copied" : "Link gekopieerd");
          } catch {
            prompt(locale === "en" ? "Copy this link" : "Kopieer deze link", url);
          }
        }}
        className="rounded-xl border bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
      >
        {locale === "en" ? "Copy link" : "Kopieer link"}
      </button>
    </div>
  );
}

export default function VerifyBanner({ locale }) {
  const sp = useSearchParams();
  const code = sp.get("verify");
  if (!code) return null;

  const isEn = locale === "en";

  const messages = {
    ok: isEn
      ? { title: "Confirmed!", body: "Your signature has been confirmed and counted. Want to help? Share it." }
      : { title: "Bevestigd!", body: "Je handtekening is bevestigd en meegeteld. Wil je helpen? Deel het." },
    already: isEn
      ? { title: "Already confirmed", body: "This signature was already confirmed earlier." }
      : { title: "Al bevestigd", body: "Deze handtekening was eerder al bevestigd." },
    invalid: isEn
      ? { title: "Invalid link", body: "This confirmation link is invalid or expired. Please sign again." }
      : { title: "Ongeldige link", body: "Deze bevestigingslink is ongeldig of verlopen. Teken opnieuw." },
    notfound: isEn
      ? { title: "Not found", body: "We couldn't find this signature." }
      : { title: "Niet gevonden", body: "We konden deze handtekening niet vinden." },
    missing: isEn
      ? { title: "Missing data", body: "This confirmation link is incomplete." }
      : { title: "Ontbrekende gegevens", body: "Deze bevestigingslink is niet compleet." },
    rate: isEn
      ? { title: "Too many tries", body: "Please wait a bit and try again." }
      : { title: "Te vaak geprobeerd", body: "Wacht even en probeer het daarna opnieuw." },
    error: isEn
      ? { title: "Something went wrong", body: "Please try again later." }
      : { title: "Er ging iets mis", body: "Probeer het later opnieuw." },
  };

  const m = messages[code] || messages.error;

  const tone =
    code === "ok"
      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
      : code === "already"
      ? "border-slate-200 bg-slate-50 text-slate-900"
      : "border-amber-200 bg-amber-50 text-amber-950";

  return (
    <div className={`mb-6 rounded-2xl border px-4 py-3 shadow-soft ${tone}`}>
      <div className="font-extrabold">{m.title}</div>
      <div className="mt-1 text-sm opacity-90">{m.body}</div>
      {code === "ok" ? <ShareRow locale={locale} /> : null}
    </div>
  );
}
