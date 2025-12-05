import createMiddleware from "next-intl/middleware";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { locales } from "./i18n/locales";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const intlMiddleware = createMiddleware(routing);

const PUBLIC_ROUTES = ["/", "/invite/*"];
const ANONYMOUS_ONLY_ROUTES = ["/user/invites/create"];

function extractLocaleInfo(pathname: string) {
  const localePattern = locales.join("|");
  const localeMatch = pathname.match(new RegExp(`^/(${localePattern})(\/|$)`));
  
  return {
    locale: localeMatch?.[1] ?? null,
    pathnameWithoutLocale: localeMatch
      ? pathname.replace(new RegExp(`^/(${localePattern})`), "") || "/"
      : pathname,
  };
}

function isRouteAllowed(
  pathnameWithoutLocale: string,
  routeList: string[]
): boolean {
  return (
    routeList.includes(pathnameWithoutLocale) ||
    pathnameWithoutLocale.startsWith("/invite") ||
    pathnameWithoutLocale.startsWith("/_next")
  );
}

function createRedirect(
  request: NextRequest,
  locale: string,
  from: string
): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  url.searchParams.set("from", from);
  return NextResponse.redirect(url);
}

function detectPreferredLocale(request: NextRequest): string {
  // 1. Check cookie first (user's explicit preference)
  const localeCookie = request.cookies.get("NEXT_LOCALE")?.value;
  if (localeCookie && locales.includes(localeCookie as any)) {
    return localeCookie;
  }

  // 2. Check Accept-Language header
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    // Parse Accept-Language header (e.g., "en-US,en;q=0.9,it;q=0.8")
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [code, qValue] = lang.trim().split(";q=");
        return {
          code: code.split("-")[0], // Extract base language (en from en-US)
          quality: qValue ? parseFloat(qValue) : 1.0,
        };
      })
      .sort((a, b) => b.quality - a.quality);

    // Find first matching locale
    for (const lang of languages) {
      if (locales.includes(lang.code as any)) {
        return lang.code;
      }
    }
  }

  // 3. Fallback to default
  return routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle locale detection for root path
  if (pathname === "/") {
    const preferredLocale = detectPreferredLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale}`;
    return NextResponse.redirect(url);
  }

  // Handle next-intl locale routing
  const intlResponse = intlMiddleware(request);
  if (intlResponse?.status === 307) {
    return intlResponse;
  }

  const { locale, pathnameWithoutLocale } = extractLocaleInfo(pathname);
  const effectiveLocale = locale || detectPreferredLocale(request);

  // Public routes - always accessible
  if (isRouteAllowed(pathnameWithoutLocale, PUBLIC_ROUTES)) {
    return intlResponse || NextResponse.next();
  }

  // Check session once
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Anonymous users - restricted access
  if (session?.user.isAnonymous) {
    return isRouteAllowed(pathnameWithoutLocale, ANONYMOUS_ONLY_ROUTES)
      ? intlResponse || NextResponse.next()
      : createRedirect(request, effectiveLocale, pathname);
  }

  // No session - redirect to home
  if (!session) {
    return createRedirect(request, effectiveLocale, pathname);
  }

  // Authenticated user - full access
  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};