import type { Metadata } from "next";
import { seoConfig, type Locale } from "./config";

export type SEOProps = {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: "website" | "article";
  noIndex?: boolean;
  canonical?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  tags?: string[];
  locale?: Locale;
};

/**
 * Generate standard metadata for public pages with i18n support
 * @param props - SEO properties
 * @returns Metadata object for Next.js
 */
export function generateSEO(props: SEOProps = {}): Metadata {
  const {
    title = seoConfig.defaultTitle,
    description = seoConfig.defaultDescription,
    keywords = [],
    image = seoConfig.defaultOgImage,
    url = seoConfig.siteUrl,
    type = "website",
    noIndex = false,
    canonical,
    publishedTime,
    modifiedTime,
    authors = [],
    tags = [],
    locale = seoConfig.defaultLocale,
  } = props;

  const fullImageUrl = image.startsWith("http")
    ? image
    : `${seoConfig.siteUrl}${image}`;
  const canonicalUrl = canonical || url;
  const ogLocale = seoConfig.localeToLanguage[locale];

  // Generate alternate language links
  const languages: Record<string, string> = {};
  seoConfig.locales.forEach((loc) => {
    const baseUrl = url.replace(`/${locale}`, "");
    languages[loc] = `${seoConfig.siteUrl}/${loc}${baseUrl.replace(
      seoConfig.siteUrl,
      ""
    )}`;
  });

  return {
    title,
    description,
    keywords,

    openGraph: {
      type,
      locale: ogLocale,
      url,
      siteName: seoConfig.siteName,
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === "article" && {
        publishedTime,
        modifiedTime,
        authors,
        tags,
      }),
    },

    twitter: {
      card: "summary_large_image",
      site: seoConfig.twitterHandle,
      creator: seoConfig.twitterHandle,
      title,
      description,
      images: [fullImageUrl],
    },

    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    alternates: {
      canonical: canonicalUrl,
      languages,
    },
  };
}

/**
 * Generate metadata for secured/private pages
 * Blocks all search engine indexing
 */
export function generateSecuredPageSEO(title: string): Metadata {
  return {
    title,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
      noimageindex: true,
      nocache: true,
    },
  };
}

/**
 * Generate metadata for blog articles with i18n
 */
export function generateArticleSEO(article: {
  title: string;
  description: string;
  slug: string;
  image?: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  tags?: string[];
  keywords?: string[];
  locale?: Locale;
}): Metadata {
  const locale = article.locale || seoConfig.defaultLocale;

  return generateSEO({
    title: article.title,
    description: article.description,
    keywords: article.keywords || article.tags,
    image: article.image,
    url: `${seoConfig.siteUrl}/${locale}/blog/${article.slug}`,
    canonical: `${seoConfig.siteUrl}/${locale}/blog/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author],
    tags: article.tags,
    locale,
  });
}

/**
 * Generate breadcrumb JSON-LD
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http")
        ? item.url
        : `${seoConfig.siteUrl}${item.url}`,
    })),
  };
}

/**
 * Generate Organization JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: seoConfig.companyName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}${seoConfig.logoUrl}`,
    description: seoConfig.defaultDescription,
    sameAs: Object.values(seoConfig.social),
    contactPoint: {
      "@type": "ContactPoint",
      telephone: seoConfig.companyPhone,
      contactType: "Customer Service",
      email: seoConfig.companyEmail,
      areaServed: "US",
      availableLanguage: seoConfig.locales,
    },
  };
}

/**
 * Generate Article JSON-LD
 */
export function generateArticleSchema(article: {
  title: string;
  description: string;
  image: string;
  publishedAt: string;
  updatedAt?: string;
  author: { name: string; url?: string };
  slug: string;
  locale?: Locale;
}) {
  const locale = article.locale || seoConfig.defaultLocale;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image.startsWith("http")
      ? article.image
      : `${seoConfig.siteUrl}${article.image}`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      "@type": "Person",
      name: article.author.name,
      url: article.author.url,
    },
    publisher: {
      "@type": "Organization",
      name: seoConfig.companyName,
      logo: {
        "@type": "ImageObject",
        url: `${seoConfig.siteUrl}${seoConfig.logoUrl}`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${seoConfig.siteUrl}/${locale}/blog/${article.slug}`,
    },
    inLanguage: locale,
  };
}

/**
 * Generate FAQ JSON-LD
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
