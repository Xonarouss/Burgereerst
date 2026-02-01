import { Resend } from "resend";

function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Resend timeout")), timeoutMs)
    ),
  ]);
}

export async function sendVerifyEmail({ to, verifyUrl, locale }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) {
    throw new Error("Missing RESEND_API_KEY or RESEND_FROM");
  }

  const resend = new Resend(apiKey);

  const subject =
    locale === "en"
      ? "Confirm your signature – BurgerEerst.nl"
      : "Bevestig je handtekening – BurgerEerst.nl";

  const heading =
    locale === "en"
      ? "One last step: confirm your signature"
      : "Nog één stap: bevestig je handtekening";

  const body =
    locale === "en"
      ? "To prevent abuse, we ask you to confirm your signature via the button below."
      : "Om misbruik te voorkomen vragen we je je handtekening te bevestigen via de knop hieronder.";

  const button = locale === "en" ? "Confirm signature" : "Bevestig handtekening";

  const footer =
    locale === "en"
      ? "If you didn't sign, you can ignore this email."
      : "Heb je niet getekend? Dan kun je deze e-mail negeren.";

  const timeoutMs = parseInt(process.env.RESEND_TIMEOUT_MS || "8000", 10);

  // The Resend SDK usually returns { data, error } and does not always throw.
  const result = await withTimeout(
    resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0f172a;">
          <h2 style="margin:0 0 8px 0;">${heading}</h2>
          <p style="margin:0 0 16px 0; color:#334155;">${body}</p>
          <p style="margin:0 0 16px 0;">
            <a href="${verifyUrl}" style="display:inline-block; background:#1d4ed8; color:white; text-decoration:none; padding:12px 16px; border-radius:14px; font-weight:700;">
              ${button}
            </a>
          </p>
          <p style="margin:0; color:#64748b; font-size:12px;">${footer}</p>
          <p style="margin:12px 0 0 0; color:#94a3b8; font-size:12px;">BurgerEerst.nl</p>
        </div>
      `,
    }),
    timeoutMs
  );

  if (result?.error) {
    const msg =
      result.error?.message ||
      result.error?.name ||
      (typeof result.error === "string"
        ? result.error
        : JSON.stringify(result.error));
    throw new Error(`Resend send failed: ${msg}`);
  }

  return result?.data || null;
}


export async function sendBlogSubscribeConfirmEmail({ to, verifyUrl, locale }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error("Missing RESEND_API_KEY or RESEND_FROM");

  const resend = new Resend(apiKey);

  const subject =
    locale === "en"
      ? "Confirm blog updates – BurgerEerst.nl"
      : "Bevestig blog-updates – BurgerEerst.nl";

  const heading =
    locale === "en"
      ? "Confirm your subscription"
      : "Bevestig je abonnement";

  const body =
    locale === "en"
      ? "Click the button below to receive email updates when new articles are published."
      : "Klik op de knop hieronder om e-mailupdates te ontvangen bij nieuwe artikelen.";

  const button = locale === "en" ? "Confirm subscription" : "Bevestig abonnement";

  const timeoutMs = parseInt(process.env.RESEND_TIMEOUT_MS || "8000", 10);

  const result = await withTimeout(
    resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0f172a;">
          <h2 style="margin:0 0 8px 0;">${heading}</h2>
          <p style="margin:0 0 16px 0; color:#334155;">${body}</p>
          <p style="margin:0 0 16px 0;">
            <a href="${verifyUrl}" style="display:inline-block; background:#0f172a; color:white; text-decoration:none; padding:12px 16px; border-radius:14px; font-weight:800;">
              ${button}
            </a>
          </p>
          <p style="margin:0; color:#64748b; font-size:12px;">BurgerEerst.nl</p>
        </div>
      `,
    }),
    timeoutMs
  );

  if (result?.error) {
    const msg =
      result.error?.message ||
      result.error?.name ||
      (typeof result.error === "string" ? result.error : JSON.stringify(result.error));
    throw new Error(`Resend send failed: ${msg}`);
  }

  return result?.data || null;
}

export async function sendBlogNewPostEmail({ to, locale, title, excerpt, url, unsubscribeUrl }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) throw new Error("Missing RESEND_API_KEY or RESEND_FROM");

  const resend = new Resend(apiKey);

  const subject =
    locale === "en"
      ? `New on BurgerEerst: ${title}`
      : `Nieuw op BurgerEerst: ${title}`;

  const heading =
    locale === "en" ? "New article published" : "Nieuw artikel gepubliceerd";

  const button = locale === "en" ? "Read article" : "Lees artikel";

  const timeoutMs = parseInt(process.env.RESEND_TIMEOUT_MS || "8000", 10);

  const safeExcerpt = excerpt ? String(excerpt).slice(0, 240) : "";

  const result = await withTimeout(
    resend.emails.send({
      from,
      to,
      subject,
      html: `
        <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; line-height: 1.5; color: #0f172a;">
          <h2 style="margin:0 0 8px 0;">${heading}</h2>
          <p style="margin:0 0 16px 0; color:#334155;"><strong>${title}</strong></p>
          ${safeExcerpt ? `<p style="margin:0 0 16px 0; color:#334155;">${safeExcerpt}</p>` : ""}
          <p style="margin:0 0 16px 0;">
            <a href="${url}" style="display:inline-block; background:#1d4ed8; color:white; text-decoration:none; padding:12px 16px; border-radius:14px; font-weight:800;">
              ${button}
            </a>
          </p>
          <p style="margin:0; color:#64748b; font-size:12px;">BurgerEerst.nl</p>
        </div>
      `,
    }),
    timeoutMs
  );

  if (result?.error) {
    const msg =
      result.error?.message ||
      result.error?.name ||
      (typeof result.error === "string" ? result.error : JSON.stringify(result.error));
    throw new Error(`Resend send failed: ${msg}`);
  }

  return result?.data || null;
}
