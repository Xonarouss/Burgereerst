import Link from "next/link";

export const metadata = {
  title: "404 – BurgerEerst.nl",
};

export default function NotFound() {
  return (
    <main className="min-h-[70vh] bg-slate-950 text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col items-start gap-6 px-4 py-16">
        <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-2">
          <span className="text-xs font-black tracking-widest text-slate-300">404</span>
          <span className="text-xs font-semibold text-slate-300">Pagina niet gevonden · Page not found</span>
        </div>

        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
          Deze pagina bestaat niet. Net als duidelijk beleid.
        </h1>

        <p className="max-w-2xl text-slate-300">
          Je hebt een link gevolgd die nergens heen leidt, of de pagina is verplaatst. Geen stress — BurgerEerst staat nog wel.
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-black text-white hover:bg-blue-700"
          >
            Terug naar de petitie
          </Link>
          <Link
            href="/nl/blog"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-100 hover:bg-white/10"
          >
            Naar de blog
          </Link>
          <Link
            href="/en"
            className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-100 hover:bg-white/10"
          >
            English site
          </Link>
        </div>

        <div className="mt-4 text-xs text-slate-400">
          Tip: als je hier vaker belandt, is het óf een kapotte link — óf iemand is weer “iets aan het testen” in productie.
        </div>
      </div>
    </main>
  );
}
