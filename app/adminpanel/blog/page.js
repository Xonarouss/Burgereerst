"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

function getStoredPw() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem("be_admin_pw") || "";
}

function setStoredPw(value) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("be_admin_pw", value);
}

async function api(path, pw, init = {}) {
  const headers = new Headers(init.headers || {});
  headers.set("Authorization", `Bearer ${pw}`);
  return fetch(path, { ...init, headers });
}

function slugify(input) {
  return String(input || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export default function AdminBlogPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");

  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    locale: "nl",
    slug: "",
    title: "",
    excerpt: "",
    author: "Chris",
    cover_image_url: "",
    cover_image_path: "",
    tagsText: "",
    published: false,
    content_md: "",
  });

  useEffect(() => {
    const saved = getStoredPw();
    if (saved) setPw(saved);
  }, []);

  async function load(pwToUse = pw) {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/admin/blog/posts?limit=500", pwToUse, { cache: "no-store" });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || `HTTP ${res.status}`);
      }
      const j = await res.json();
      setRows(j.data || []);
      setAuthed(true);
      setStoredPw(pwToUse);
    } catch (e) {
      setAuthed(false);
      setError(e.message || "Onbekende fout");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => [r.title, r.slug, r.locale, r.author].some((v) => String(v || "").toLowerCase().includes(q)));
  }, [rows, filter]);

  function startNew() {
    setEditing(null);
    setForm({
      locale: "nl",
      slug: "",
      title: "",
      excerpt: "",
      author: "Chris",
      cover_image_url: "",
      cover_image_path: "",
      tagsText: "",
      published: false,
      content_md: "",
    });
  }

  function startEdit(r) {
    setEditing(r);
    setForm({
      locale: r.locale || "nl",
      slug: r.slug || "",
      title: r.title || "",
      excerpt: r.excerpt || "",
      author: r.author || "Chris",
      cover_image_url: r.cover_image_url || "",
      cover_image_path: r.cover_image_path || "",
      tagsText: Array.isArray(r.tags) ? r.tags.join(", ") : "",
      published: !!r.published,
      content_md: r.content_md || "",
    });
  }

  async function loadFullAndEdit(r) {
    // Reuse list route and then fetch the single post via the same POST update pattern isn't needed.
    // We'll do a direct fetch on the Supabase side by calling POST with id only? Not.
    // Instead: add a quick fetch by calling list and using returned row if it already contains content.
    startEdit(r);
  }

  async function save() {
    setError("");
    const tags = form.tagsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 20);

    const payload = {
      id: editing?.id,
      locale: form.locale,
      slug: form.slug,
      title: form.title,
      excerpt: form.excerpt,
      author: form.author,
      cover_image_url: form.cover_image_url || null,
      cover_image_path: form.cover_image_path || null,
      tags,
      published: !!form.published,
      content_md: form.content_md,
    };

    const res = await api("/api/admin/blog/posts", pw, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `HTTP ${res.status}`);
      return;
    }

    await load(pw);
    setError("");
  }

  async function remove(id) {
    if (!confirm("Weet je zeker dat je dit artikel wilt verwijderen?")) return;
    setError("");
    const res = await api(`/api/admin/blog/posts?id=${encodeURIComponent(id)}`, pw, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `HTTP ${res.status}`);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editing?.id === id) startNew();
  }

  async function uploadCover(file) {
    setError("");
    const fd = new FormData();
    fd.set("file", file);
    fd.set("folder", "covers");

    const res = await api("/api/admin/blog/upload", pw, { method: "POST", body: fd });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      throw new Error(j.error || `HTTP ${res.status}`);
    }
    const j = await res.json();
    return j;
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tight">BurgerEerst – Blog CMS</h1>
            <p className="mt-1 text-sm text-slate-300">
              Beheer je blogposts (Markdown + afbeeldingen). Terug naar het <Link className="font-semibold text-blue-300 hover:underline" href="/adminpanel">admin panel</Link>.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
            >
              ← Terug naar site
            </Link>
            <button
              onClick={() => load(pw)}
              disabled={loading || !pw}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? "Laden…" : "Inloggen / vernieuwen"}
            </button>
            <button
              onClick={startNew}
              className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
            >
              Nieuw artikel
            </button>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="w-full md:max-w-md">
              <label className="text-xs font-semibold text-slate-300">Admin wachtwoord</label>
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="ADMIN_PASSWORD"
              />
            </div>
            <div className="w-full md:max-w-md">
              <label className="text-xs font-semibold text-slate-300">Zoeken</label>
              <input
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="titel, slug, auteur…"
              />
            </div>
          </div>
          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </div>

        {authed ? (
          <div className="mt-6 grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-slate-200">Artikelen</div>
                <div className="mt-3 space-y-2">
                  {filtered.length === 0 ? (
                    <div className="text-sm text-slate-300">Geen resultaten.</div>
                  ) : (
                    filtered.map((r) => (
                      <div key={r.id} className="rounded-xl border border-white/10 bg-slate-950 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-extrabold text-white">{r.title}</div>
                            <div className="mt-1 text-xs text-slate-300">
                              {r.locale} · /{r.locale}/blog/{r.slug} · {r.published ? "PUBLISHED" : "DRAFT"}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
            >
              ← Terug naar site
            </Link>
                            <button
                              onClick={() => startEdit(r)}
                              className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white"
                            >
                              Bewerken
                            </button>
                            <button
                              onClick={() => remove(r.id)}
                              className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white"
                            >
                              Verwijderen
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="text-sm font-bold text-slate-200">Editor</div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Taal</label>
                    <select
                      value={form.locale}
                      onChange={(e) => setForm((f) => ({ ...f, locale: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                    >
                      <option value="nl">nl</option>
                      <option value="en">en</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300">Auteur</label>
                    <input
                      value={form.author}
                      onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Titel</label>
                    <input
                      value={form.title}
                      onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: f.slug || slugify(e.target.value) }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      placeholder="Titel van het artikel"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Slug</label>
                    <input
                      value={form.slug}
                      onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      placeholder="bijv: kabinet-kosten-stapelen"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Korte samenvatting (excerpt)</label>
                    <textarea
                      value={form.excerpt}
                      onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      rows={2}
                      placeholder="1–2 zinnen. Komt in previews + OpenGraph."
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Tags (komma-gescheiden)</label>
                    <input
                      value={form.tagsText}
                      onChange={(e) => setForm((f) => ({ ...f, tagsText: e.target.value }))}
                      className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      placeholder="bijv: bestaanszekerheid, zorg, btw"
                    />
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-white/10 bg-slate-950 p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-200">Cover image</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const up = await uploadCover(file);
                          setForm((f) => ({ ...f, cover_image_url: up.url || "", cover_image_path: up.path || "" }));
                        } catch (err) {
                          setError(err.message || "Upload mislukt");
                        }
                      }}
                      className="text-sm text-slate-300"
                    />
                  </div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                      value={form.cover_image_url}
                      onChange={(e) => setForm((f) => ({ ...f, cover_image_url: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      placeholder="https://..."
                    />
                    <input
                      value={form.cover_image_path}
                      onChange={(e) => setForm((f) => ({ ...f, cover_image_path: e.target.value }))}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none"
                      placeholder="storage path (automatisch)"
                    />
                  </div>
                  {form.cover_image_url ? (
                    <div className="mt-3 overflow-hidden rounded-xl border border-white/10">
                      <img src={form.cover_image_url} alt="cover" className="h-auto w-full" />
                    </div>
                  ) : null}
                </div>

                <div className="mt-4">
                  <label className="text-xs font-semibold text-slate-300">Markdown content</label>
                  <textarea
                    value={form.content_md}
                    onChange={(e) => setForm((f) => ({ ...f, content_md: e.target.value }))}
                    className="mt-1 w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-3 font-mono text-xs leading-relaxed outline-none focus:ring-2 focus:ring-blue-500"
                    rows={18}
                    placeholder="# Titel\n\nSchrijf je artikel in Markdown…"
                  />
                </div>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-200">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
                    />
                    Published
                  </label>

                  <div className="flex flex-wrap gap-2">
            <Link
              href="/"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
            >
              ← Terug naar site
            </Link>
                    <button
                      onClick={save}
                      className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white"
                    >
                      Opslaan
                    </button>
                    {form.locale && form.slug ? (
                      <a
                        href={`/${form.locale}/blog/${form.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
                      >
                        Preview
                      </a>
                    ) : null}
                  </div>
                </div>

                <p className="mt-3 text-xs text-slate-400">
                  Tip: zet {""}
                  <code className="rounded bg-white/10 px-2 py-0.5">SITE_URL</code>{""}
                  in je env (bijv. https://burgereerst.nl) zodat share-links en OG correct zijn.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Log in om blogposts te beheren.
          </div>
        )}
      </div>
    </main>
  );
}
