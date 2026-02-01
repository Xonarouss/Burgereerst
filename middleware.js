import { NextResponse } from "next/server";

const LOCALES = ["nl", "en"];

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Ignore Next internals & API
  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.startsWith("/favicon") || pathname.startsWith("/og.png") || pathname.startsWith("/adminpanel")) {
    return NextResponse.next();
  }

  // Already localized?
  const hasLocale = LOCALES.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
  if (hasLocale) return NextResponse.next();

  // Redirect / -> /nl (default)
  const url = request.nextUrl.clone();
  url.pathname = `/nl${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!.*\..*).*)"],
};
