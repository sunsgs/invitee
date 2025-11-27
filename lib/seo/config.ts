import { routing } from "@/i18n/routing";

export const seoConfig = {
  siteName: "SMOOU",
  defaultTitle: "SMOOU - Invites too good to be ignored",
  titleTemplate: "%s | Your Brand Name",
  defaultDescription:
    "Default compelling description for your site (155-160 chars)",
  siteUrl: process.env.NEXT_PUBLIC_APP_URL,
  twitterHandle: "@yourtwitterhandle",

  // Supported locales
  locales: routing.locales,
  defaultLocale: routing.defaultLocale,

  // Default images
  defaultOgImage: "/og-image.jpg",
  defaultTwitterImage: "/twitter-image.jpg",
  logoUrl: "/logo.png",

  // Company info
  companyName: "Your Company Name",
  companyEmail: "contact@yourdomain.com",
  companyPhone: "+1-555-555-5555",

  // Social links
  social: {
    twitter: "https://twitter.com/yourhandle",
    linkedin: "https://linkedin.com/company/yourcompany",
    facebook: "https://facebook.com/yourpage",
  },

  // Verification codes
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    bing: "your-bing-verification-code",
  },

  // Locale to language mapping
  localeToLanguage: {
    en: "en_US",
    it: "it_IT",
    pl: "pl_PL",
  } as const,
} as const;

export type Locale = (typeof seoConfig.locales)[number];
