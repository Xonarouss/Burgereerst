export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { getDict, t } from "@/lib/i18n";
import { listPublishedPosts } from "@/lib/blog";
import BlogSubscribe from "@/components/BlogSubscribe";

export default async function BlogIndex({ params, searchParams }) {
  const dict = getDict(params.locale);
  const posts = await listPublishedPosts({ locale: params.locale, limit: 100 });

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Blog</h1>
          <p className="mt-2 max-w-3xl text-slate-700">
            Updates, duiding en context van BurgerEerst.
          </p>
        </div>
        <a
          href="/rss.xml"
          className="inline-flex items-center gap-2 rounded-2xl border bg-white px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          RSS
        </a>
      </div>
      {searchParams?.sub === "ok" ? (
        <div className="mt-6 rounded-3xl border bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
          {params.locale === "nl" ? "Abonnement bevestigd. Je krijgt updates bij nieuwe artikelen." : "Subscription confirmed. You'll get updates when new articles are published."}
        </div>
      ) : searchParams?.sub === "fail" ? (
        <div className="mt-6 rounded-3xl border bg-rose-50 p-4 text-sm font-semibold text-rose-900">
          {params.locale === "nl" ? "Bevestigen lukte niet (link verlopen of al gebruikt)." : "Confirmation failed (link expired or already used)."}
        </div>
      ) : null}

      {posts.length === 0 ? (
        <div className="mt-8 rounded-3xl border bg-white p-8 text-slate-700 shadow-soft">
          Nog geen artikelen.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {posts.map((p) => (
            <Link
              key={p.id}
              href={`/${params.locale}/blog/${p.slug}`}
              className="group overflow-hidden rounded-3xl border bg-white shadow-soft hover:shadow-lg"
            >
              {p.cover_image_url ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-slate-100">
                  <img
                    src={p.cover_image_url}
                    alt={p.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                </div>
              ) : null}

              <div className="p-6">
                <div className="text-xs font-semibold text-slate-500">
                  {p.published_at ? new Date(p.published_at).toLocaleDateString(params.locale) : ""}
                  {p.author ? ` · ${p.author}` : ""}
                </div>
                <h2 className="mt-2 text-xl font-extrabold text-slate-900 group-hover:underline">
                  {p.title}
                </h2>
                {p.excerpt ? <p className="mt-2 text-sm text-slate-700">{p.excerpt}</p> : null}
                <div className="mt-4 text-sm font-semibold text-blue-700">Lees verder →</div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <BlogSubscribe locale={params.locale} />
    </section>
  );
}
