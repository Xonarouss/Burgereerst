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

export default function AdminPanelPage() {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    const saved = getStoredPw();
    if (saved) {
      setPw(saved);
      // don't auto-mark authed; we'll validate with a fetch
    }
  }, []);

  async function load(pwToUse) {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/admin/signatures?limit=5000", pwToUse, { cache: "no-store" });
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
    return rows.filter((r) =>
      [r.full_name, r.city, r.email, String(r.id)].some((v) => String(v || "").toLowerCase().includes(q))
    );
  }, [rows, filter]);

  async function remove(id) {
    if (!confirm("Weet je zeker dat je deze handtekening wilt verwijderen?")) return;
    setError("");
    const res = await api(`/api/admin/signatures?id=${encodeURIComponent(id)}`, pw, { method: "DELETE" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `HTTP ${res.status}`);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  async function verify(id) {
    setError("");
    const res = await api("/api/admin/verify", pw, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `HTTP ${res.status}`);
      return;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, verified: true } : r)));
  }

  async function downloadCsv() {
    setError("");
    const res = await api("/api/admin/export", pw, { cache: "no-store" });
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error || `HTTP ${res.status}`);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "burgereerst-signatures.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-black tracking-tight">BurgerEerst – Admin Panel</h1>
        <p className="mt-2 text-sm text-slate-300">
          Verborgen beheerpagina. Deel deze URL niet. Auth gebeurt via <code className="rounded bg-white/10 px-2 py-0.5">ADMIN_PASSWORD</code>.
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link
            href="/"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
          >
            ← Terug naar BurgerEerst.nl
          </Link>
          <Link
            href="/adminpanel/blog"
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-slate-100 hover:bg-white/10"
          >
            Naar Blog CMS →
          </Link>
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
            <button
              onClick={() => load(pw)}
              disabled={loading || !pw}
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50"
            >
              {loading ? "Laden…" : "Inloggen / vernieuwen"}
            </button>
          </div>

          {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
        </div>

        {authed ? (
          <>
            <div className="mt-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="text-sm text-slate-300">Totaal geladen: <span className="font-extrabold text-white">{rows.length}</span></div>
                <div className="text-xs text-slate-400">Let op: dit toont maximaal 5000 records (pas aan in code indien nodig).</div>
              </div>
              <div className="flex flex-col gap-3 md:flex-row md:items-center">
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Zoeken (naam, stad, email)…"
                  className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 md:w-80"
                />
                <button onClick={downloadCsv} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
                  Download CSV
                </button>
                <Link href="/adminpanel/blog" className="rounded-xl bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15">
                  Blog CMS
                </Link>
              </div>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Naam</th>
                      <th className="px-4 py-3">Stad</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Verified</th>
                      <th className="px-4 py-3">Datum</th>
                      <th className="px-4 py-3">Acties</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filtered.map((r) => (
                      <tr key={r.id} className="hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold text-white">{r.full_name}</td>
                        <td className="px-4 py-3 text-slate-200">{r.city}</td>
                        <td className="px-4 py-3 text-slate-200">{r.email}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${r.verified ? "bg-emerald-500/20 text-emerald-200" : "bg-amber-500/20 text-amber-200"}`}>
                            {r.verified ? "JA" : "NEE"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-300">{new Date(r.created_at).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            {!r.verified ? (
                              <button onClick={() => verify(r.id)} className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white">
                                Verifiëren
                              </button>
                            ) : null}
                            <button onClick={() => remove(r.id)} className="rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
                              Verwijderen
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            Log in om signatures te beheren.
          </div>
        )}
      </div>
    </main>
  );
}
