// Small helper for “x time ago” labels in NL/EN.

function pickUnit(diffSecondsAbs) {
  const minute = 60;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffSecondsAbs >= year) return ["year", year];
  if (diffSecondsAbs >= month) return ["month", month];
  if (diffSecondsAbs >= week) return ["week", week];
  if (diffSecondsAbs >= day) return ["day", day];
  if (diffSecondsAbs >= hour) return ["hour", hour];
  if (diffSecondsAbs >= minute) return ["minute", minute];
  return ["second", 1];
}

export function formatTimeAgo(dateInput, locale = "nl") {
  if (!dateInput) return "";
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return "";

  const now = Date.now();
  const diffSeconds = Math.round((d.getTime() - now) / 1000);
  const abs = Math.abs(diffSeconds);
  const [unit, unitSeconds] = pickUnit(abs);
  const value = Math.round(diffSeconds / unitSeconds);

  try {
    const rtf = new Intl.RelativeTimeFormat(locale === "en" ? "en" : "nl", { numeric: "auto" });
    return rtf.format(value, unit);
  } catch {
    // Fallback
    const v = Math.abs(value);
    const suffix = diffSeconds < 0 ? (locale === "en" ? "ago" : "geleden") : (locale === "en" ? "in" : "over");
    return `${suffix} ${v} ${unit}`;
  }
}
