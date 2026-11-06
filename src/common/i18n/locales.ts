export const LOCALES = ["es", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "es";

export const INTL_LOCALES: Record<Locale, string> = {
  es: "es-CL",
  en: "en-US",
};

export function hasLocale(candidate: string): candidate is Locale {
  return LOCALES.some((locale) => locale === candidate);
}

export const LOCALE_FLAGS: Record<Locale, string> = {
  es: "🇪🇸",
  en: "🇺🇸",
};

export const LOCALE_NAMES: Record<Locale, string> = {
  es: "Español",
  en: "English",
};

export function resolveLocale(candidate: string): Locale {
  return hasLocale(candidate) ? candidate : DEFAULT_LOCALE;
}
