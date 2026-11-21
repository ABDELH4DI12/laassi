// Content can be written once ("React": the same in every language) or per language:
//   { en: "Hello", fr: "Bonjour", ar: "مرحبًا" }
// tx() picks the language, falling back to English. It also works on lists and on
// per-language lists ({ en: ["…", "…"], fr: [...], ar: [...] }).
export const LANGS = ["en", "fr", "ar"];

export function tx(value, lang) {
  if (value == null) return value;
  if (Array.isArray(value)) return value.map((v) => tx(v, lang));
  if (typeof value === "object" && LANGS.some((l) => l in value)) return tx(value[lang] ?? value.en ?? Object.values(value)[0], lang);
  return value;
}

export const hasArabic = (text) => /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFC]/.test(String(text ?? ""));
