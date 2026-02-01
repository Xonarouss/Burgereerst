export const dynamic = "force-dynamic";
export const revalidate = 0;

import Link from "next/link";
import { notFound } from "next/navigation";
import { getDict } from "@/lib/i18n";
import { getPublishedPostBySlug } from "@/lib/blog";
import { renderMarkdownToHtml } from "@/lib/markdown";
import ShareButtons from "@/components/ShareButtons";

export async function generateMetadata({ params }) {
  const post = await getPublishedPostBySlug({ locale: params.locale, slug: params.slug });
  if (!post) return {};

  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl").replace(/\/$/, "");
  const url = `${siteUrl}/${params.locale}/blog/${post.slug}`;
  const title = `${post.title} – BurgerEerst.nl`;
  const description = post.excerpt || "";
  const image = post.cover_image_url || "/og.png";

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "BurgerEerst.nl",
      images: [{ url: image, width: 1200, height: 630, alt: post.title }],
      locale: params.locale === "en" ? "en_US" : "nl_NL",
      type: "article",
      publishedTime: post.published_at || undefined,
      modifiedTime: post.updated_at || undefined,
      authors: post.author ? [post.author] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function BlogPostPage({ params }) {
  const dict = getDict(params.locale);
  const post = await getPublishedPostBySlug({ locale: params.locale, slug: params.slug });
  if (!post) return notFound();

  const siteUrl = (process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl").replace(/\/$/, "");
  const shareUrl = `${siteUrl}/${params.locale}/blog/${post.slug}`;

  const html = renderMarkdownToHtml(post.content_md || "");

  return (
    <article className="mx-auto max-w-3xl px-4 py-14">
      <div className="text-sm text-slate-600">
        <Link href={`/${params.locale}/blog`} className="font-semibold text-blue-700 hover:underline">
          ← Blog
        </Link>
      </div>

      <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
        {post.title}
      </h1>

      <div className="mt-3 text-sm text-slate-600">
        {post.published_at ? new Date(post.published_at).toLocaleDateString(params.locale, { year: "numeric", month: "long", day: "numeric" }) : ""}
        {post.author ? ` · ${post.author}` : ""}
      </div>

      {post.cover_image_url ? (
        <div className="mt-6 overflow-hidden rounded-3xl border bg-slate-100">
          <img src={post.cover_image_url} alt={post.title} className="h-auto w-full" />
        </div>
      ) : null}

      {post.excerpt ? (
        <p className="mt-6 text-lg font-semibold text-slate-800">
          {post.excerpt}
        </p>
      ) : null}

      <div className="mt-8 rounded-3xl border bg-white p-5 shadow-soft">
        <div className="text-sm font-semibold text-slate-800">Delen</div>
        <div className="mt-3">
          <ShareButtons url={shareUrl} title={post.title} />
        </div>
      </div>

      <div
        className="markdown mt-10"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-12 rounded-3xl border bg-slate-50 p-6 text-sm text-slate-700">
        <div className="font-semibold">Opmerking</div>
        <p className="mt-1">
          Dit is een burgerinitiatief. We streven naar duidelijke uitleg en redelijke argumenten — ook als de boodschap scherp is.
        </p>
      </div>

      <div className="mt-10">
        <Link href={`/${params.locale}#petitie`} className="inline-flex rounded-2xl bg-blue-700 px-5 py-3 text-base font-semibold text-white shadow-soft hover:bg-blue-800">
          {dict?.home?.ctaPrimary || "Onderteken"}
        </Link>
      </div>
    </article>
  );
}
