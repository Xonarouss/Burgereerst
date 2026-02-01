"use client";

import { useEffect, useMemo, useState } from "react";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

export default function BlogSubscribe({ locale }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [pushStatus, setPushStatus] = useState("");
  const vapidPublic = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

  async function subscribeEmail(e) {
    e?.preventDefault?.();
    setStatus("");
    const value = email.trim();
    if (!value || !value.includes("@")) {
      setStatus(locale === "nl" ? "Vul een geldig e-mailadres in." : "Enter a valid email address.");
      return;
    }

    const res = await fetch("/api/blog/subscribe/email", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: value, locale }),
    });

    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus((j?.error || "error") + "");
      return;
    }

    setStatus(locale === "nl" ? "Check je inbox om te bevestigen." : "Check your inbox to confirm.");
    setEmail("");
  }

  async function enablePush() {
    setPushStatus("");
    if (!vapidPublic) {
      setPushStatus(locale === "nl" ? "Push is nog niet geconfigureerd (VAPID key ontbreekt)." : "Push isn't configured (missing VAPID key).");
      return;
    }
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setPushStatus(locale === "nl" ? "Push wordt niet ondersteund in deze browser." : "Push isn't supported in this browser.");
      return;
    }

    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setPushStatus(locale === "nl" ? "Geen toestemming voor notificaties." : "Notification permission denied.");
        return;
      }

      const reg = await navigator.serviceWorker.register("/sw.js");
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublic),
      });

      const res = await fetch("/api/blog/subscribe/push", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ locale, subscription: sub }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setPushStatus((j?.error || "error") + "");
        return;
      }

      setPushStatus(locale === "nl" ? "Push-notificaties staan aan." : "Push notifications enabled.");
    } catch (e) {
      setPushStatus((e?.message || "error") + "");
    }
  }

  return (
    <div className="mt-10 rounded-3xl border bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="text-sm font-extrabold text-slate-900">
            {locale === "nl" ? "Notificaties" : "Notifications"}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-slate-700">
            {locale === "nl"
              ? "Wil je een seintje bij nieuwe artikelen? Abonneer via e-mail of zet push aan."
              : "Want a heads-up when new articles drop? Subscribe via email or enable push."}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <form onSubmit={subscribeEmail} className="flex flex-1 gap-2">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder={locale === "nl" ? "jij@voorbeeld.nl" : "you@example.com"}
              className="w-full min-w-[220px] rounded-2xl border bg-white px-4 py-2 text-sm text-slate-900"
            />
            <button
              type="submit"
              className="rounded-2xl bg-blue-600 px-4 py-2 text-sm font-extrabold text-white hover:bg-blue-700"
            >
              {locale === "nl" ? "E-mail" : "Email"}
            </button>
          </form>

          <button
            onClick={enablePush}
            className="rounded-2xl border bg-slate-900 px-4 py-2 text-sm font-extrabold text-white hover:bg-slate-800"
          >
            {locale === "nl" ? "Push aan" : "Enable push"}
          </button>
        </div>
      </div>

      {status ? <div className="mt-3 text-sm text-slate-700">{status}</div> : null}
      {pushStatus ? <div className="mt-2 text-sm text-slate-700">{pushStatus}</div> : null}
      <div className="mt-3 text-xs text-slate-500">
        {locale === "nl"
          ? "E-mail werkt overal. Push werkt in de meeste browsers (iOS kan beperkt zijn)."
          : "Email works everywhere. Push works in most browsers (iOS can be limited)."}
      </div>
    </div>
  );
}
