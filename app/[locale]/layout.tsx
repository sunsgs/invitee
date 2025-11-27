import { StructuredData } from "@/components/structured-data";
import { Locale, seoConfig } from "@/lib/seo/config";
import { generateOrganizationSchema } from "@/lib/seo/helpers";
import { Providers } from "@/providers";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { Toaster } from "sonner";
import { allFontVariables } from "../fonts";
import "../globals.css";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export function generateStaticParams() {
  return seoConfig.locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(seoConfig.siteUrl),
    title: {
      default: seoConfig.defaultTitle,
      template: seoConfig.titleTemplate,
    },
    description: seoConfig.defaultDescription,
    verification: seoConfig.verification,
    alternates: {
      canonical: `${seoConfig.siteUrl}/${locale}`,
      languages: seoConfig.locales.reduce((acc, loc) => {
        acc[loc] = `${seoConfig.siteUrl}/${loc}`;
        return acc;
      }, {} as Record<string, string>),
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  const messages = await getMessages();
  if (!seoConfig.locales.includes(locale as Locale)) {
    notFound();
  }

  return (
    <html lang={locale} className={allFontVariables} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <StructuredData data={generateOrganizationSchema()} />
      </head>
      <body className={`font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider locale={locale} messages={messages}>
            <Providers>{children}</Providers>
          </NextIntlClientProvider>
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
