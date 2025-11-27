import createMiddleware from "next-intl/middleware";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { auth } from "./lib/auth";

const intlProxy = createMiddleware(routing);

const PUBLIC_ROUTES = ["/", "/invite/*"];
const ANONYMOUS_ONLY_ROUTES = ["/user/invites/create"];

function extractLocaleInfo(pathname: string) {
  const localeMatch = pathname.match(/^\/(it|en)(\/|$)/);
  return {
    locale: localeMatch?.[1] ?? "it",
    pathnameWithoutLocale: localeMatch
      ? pathname.replace(/^\/(it|en)/, "") || "/"
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

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle next-intl locale routing
  const intlResponse = intlProxy(request);
  if (intlResponse?.status === 307) {
    return intlResponse;
  }

  const { locale, pathnameWithoutLocale } = extractLocaleInfo(pathname);

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
      : createRedirect(request, locale, pathname);
  }

  // No session - redirect to home
  if (!session) {
    return createRedirect(request, locale, pathname);
  }

  // Authenticated user - full access
  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
