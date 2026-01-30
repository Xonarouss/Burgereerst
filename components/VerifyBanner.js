'use client';

import { useSearchParams } from "next/navigation";

export default function VerifyBanner({ locale, dict }) {
  const sp = useSearchParams();
  const code = sp.get("verify");
  if (!code) return null;

  const isEn = locale === "en";

  const messages = {
    ok: isEn
      ? { title: "Confirmed!", body: "Your signature has been confirmed and counted. Thank you." }
      : { title: "Bevestigd!", body: "Je handtekening is bevestigd en meegeteld. Dankjewel." },
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
    </div>
  );
}
