import nl from "./messages/nl.json";
import en from "./messages/en.json";

const DICTS = { nl, en };

export function getDict(locale) {
  return DICTS[locale] || DICTS.nl;
}

export function t(dict, key) {
  const parts = key.split(".");
  let cur = dict;
  for (const p of parts) cur = cur?.[p];
  return typeof cur === "string" ? cur : key;
}
