"use client";
import { localeInfo, locales } from "@/i18n/locales";
import { useRouter } from "@/i18n/navigation";
import { Languages, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("PROFILE");

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;

    startTransition(() => {
      try {
        // Update localStorage immediately before navigation
        if (typeof window !== "undefined") {
          localStorage.setItem("i18nextLng", newLocale);
        }

        // Extract the path without locale
        const segments = pathname.split("/");
        const localeIndex = segments.findIndex((seg) =>
          locales.includes(seg as any)
        );

        // Remove locale segment if found
        if (localeIndex > 0) {
          segments.splice(localeIndex, 1);
        }

        const barePath = segments.join("/") || "/";
        router.push(barePath, { locale: newLocale });
      } catch (error) {
        console.error("Failed to switch language:", error);
        // Update localStorage in fallback as well
        if (typeof window !== "undefined") {
          localStorage.setItem("i18nextLng", newLocale);
        }
        // Fallback: hard refresh with new locale
        window.location.href = `/${newLocale}${pathname.replace(
          new RegExp(`^/(${locales.join("|")})`),
          ""
        )}`;
      }
    });
  };

  const currentLanguage = localeInfo[locale as keyof typeof localeInfo];

  return (
    <div className="space-y-2">
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        disabled={isPending}
      >
        <SelectTrigger
          id="language-selector"
          className="w-[200px] relative bg-card"
          aria-label="Select language"
        >
          <div className="flex items-center gap-2">
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Languages className="h-4 w-4" />
            )}
            <SelectValue>
              <span className="flex items-center gap-2">
                <span>{currentLanguage?.flag}</span>
                <span>{currentLanguage?.nativeName}</span>
              </span>
            </SelectValue>
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {locales.map((langCode) => {
              const language = localeInfo[langCode];

              return (
                <SelectItem
                  key={langCode}
                  value={langCode}
                  className="cursor-pointer"
                  disabled={langCode === locale}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{language.flag}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{language.nativeName}</span>
                      <span className="text-xs text-muted-foreground">
                        {language.name}
                      </span>
                    </div>
                    {langCode === locale && (
                      <span className="ml-auto text-xs text-muted-foreground">
                        (Current)
                      </span>
                    )}
                  </div>
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending && (
        <p className="text-xs text-muted-foreground">Switching language...</p>
      )}
    </div>
  );
}