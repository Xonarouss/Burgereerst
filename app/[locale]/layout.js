import { getDict, t } from "@/lib/i18n";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export async function generateMetadata({ params }) {
  const dict = getDict(params.locale);
  const title = t(dict, "site.name");
  const description = t(dict, "site.metaDescription");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://burgereerst.nl";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title,
      description,
      url: siteUrl,
      siteName: title,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: title }],
      locale: params.locale === "en" ? "en_US" : "nl_NL",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og.png"],
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/favicon.png",
    },
  };
}

export default function LocaleLayout({ children, params }) {
  const dict = getDict(params.locale);

  return (
    <html lang={params.locale}>
      <body>
        <Navbar locale={params.locale} dict={dict} />
        <main className="min-h-[70vh]">{children}</main>
        <Footer locale={params.locale} dict={dict} />
      </body>
    </html>
  );
}

export function generateStaticParams() {
  return [{ locale: "nl" }, { locale: "en" }];
}
