import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME } from "@/shared/config/auth";

const PUBLIC_PATHS = ["/login", "/register", "/register/terms", "/onboarding", "/forgot-password", "/reset-password", "/terms"];

function detectLocale(req: NextRequest): "ko" | "en" {
  const acceptLanguage = req.headers.get("accept-language") ?? "";
  return acceptLanguage.toLowerCase().includes("ko") ? "ko" : "en";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 로케일 쿠키가 없으면 Accept-Language 기반으로 설정
  const hasLocaleCookie = req.cookies.has("locale");
  const response = NextResponse.next();
  if (!hasLocaleCookie) {
    response.cookies.set("locale", detectLocale(req), {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) || pathname === "/") {
    return response;
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "",
    cookieName: AUTH_COOKIE_NAME,
    salt: AUTH_COOKIE_NAME,
  });

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon|icon|sitemap|robots).*)"],
};
