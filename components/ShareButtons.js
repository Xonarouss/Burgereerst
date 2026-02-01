"use client";

import { useMemo } from "react";

function enc(v) {
  return encodeURIComponent(v || "");
}

export default function ShareButtons({ url, title }) {
  const links = useMemo(() => {
    const u = url;
    const t = title || "";
    return {
      whatsapp: `https://wa.me/?text=${enc(t + "\n" + u)}`,
      twitter: `https://twitter.com/intent/tweet?text=${enc(t)}&url=${enc(u)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${enc(u)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(u)}`,
    };
  }, [url, title]);

  async function nativeShare() {
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      }
    } catch {
      // ignore
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link gekopieerd");
    } catch {
      prompt("Kopieer de link:", url);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={nativeShare}
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        Delen
      </button>
      <a
        href={links.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        WhatsApp
      </a>
      <a
        href={links.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        X
      </a>
      <a
        href={links.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        Facebook
      </a>
      <a
        href={links.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        LinkedIn
      </a>
      <button
        type="button"
        onClick={copy}
        className="rounded-xl border bg-white px-3 py-2 text-sm font-semibold text-slate-800 hover:bg-slate-50"
      >
        Kopieer link
      </button>
    </div>
  );
}
