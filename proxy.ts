import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const intlProxy = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Let next-intl handle the locale routing first
  const intlResponse = intlProxy(request);

  // If next-intl wants to redirect (e.g., from / to /it), allow it
  if (intlResponse && intlResponse.status === 307) {
    return intlResponse;
  }

  // Extract locale from pathname (e.g., /en/user/profile -> en)
  const localeMatch = pathname.match(/^\/(it|en)(\/|$)/);
  const pathnameWithoutLocale = localeMatch
    ? pathname.replace(/^\/(it|en)/, "") || "/"
    : pathname;

  // Public routes (without locale prefix)
  const publicRoutes = ["/", "/signin"];

  const isPublicRoute =
    publicRoutes.includes(pathnameWithoutLocale) ||
    pathnameWithoutLocale.startsWith("/invites") ||
    pathnameWithoutLocale.startsWith("/_next");

  if (isPublicRoute) {
    return intlResponse || NextResponse.next();
  }

  // Check for session cookie existence
  const hasSession = request.cookies.has("better-auth.session_token");

  if (!hasSession) {
    const url = request.nextUrl.clone();
    // Redirect to the root of current locale
    const currentLocale = localeMatch ? localeMatch[1] : "it";
    url.pathname = `/${currentLocale}`;
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return intlResponse || NextResponse.next();
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
