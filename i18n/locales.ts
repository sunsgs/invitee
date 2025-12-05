export const locales = ["it", "en", "pl"] as const;
export type Locale = (typeof locales)[number];

export const localeInfo: Record<
  Locale,
  { nativeName: string; name: string; flag: string }
> = {
  it: { nativeName: "Italiano", name: "Italian", flag: "🇮🇹" },
  en: { nativeName: "English", name: "English", flag: "🇬🇧" },
  pl: { nativeName: "Polski", name: "Polish", flag: "🇵🇱" },
};