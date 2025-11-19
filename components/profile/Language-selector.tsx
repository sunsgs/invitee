"use client";

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

const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
] as const;

export default function LanguageSelector() {
  const locale = useLocale();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const t = useTranslations("PROFILE");

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return; // Don't switch if already on this locale

    startTransition(() => {
      try {
        // Extract the path without locale
        const segments = pathname.split("/");
        const localeIndex = segments.findIndex((seg) =>
          LANGUAGES.some((lang) => lang.code === seg)
        );

        // Remove locale segment if found
        if (localeIndex > 0) {
          segments.splice(localeIndex, 1);
        }

        const barePath = segments.join("/") || "/";
        router.push(barePath, { locale: newLocale });
      } catch (error) {
        console.error("Failed to switch language:", error);
        // Fallback: hard refresh with new locale
        window.location.href = `/${newLocale}${pathname.replace(
          /^\/(en|it)/,
          ""
        )}`;
      }
    });
  };

  const currentLanguage = LANGUAGES.find((lang) => lang.code === locale);

  return (
    <div className="space-y-2">
      <Select
        value={locale}
        onValueChange={handleLanguageChange}
        disabled={isPending}
      >
        <SelectTrigger
          id="language-selector"
          className="w-[200px] relative"
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
            {LANGUAGES.map((language) => (
              <SelectItem
                key={language.code}
                value={language.code}
                className="cursor-pointer"
                disabled={language.code === locale}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="flex flex-col">
                    <span className="font-medium">{language.nativeName}</span>
                    <span className="text-xs text-muted-foreground">
                      {language.name}
                    </span>
                  </div>
                  {language.code === locale && (
                    <span className="ml-auto text-xs text-muted-foreground">
                      (Current)
                    </span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      {isPending && (
        <p className="text-xs text-muted-foreground">Switching language...</p>
      )}
    </div>
  );
}
