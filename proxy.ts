import { NextResponse } from "next/server";

import { auth } from "@/auth";

export const config = {
  matcher: ["/dashboard/:path*", "/records/:path*", "/feedback/:path*", "/settings/:path*"],
};

export default auth((req: { auth?: unknown; nextUrl: { origin: string; pathname: string } }) => {
  if (!req.auth) {
    const loginUrl = new URL("/login", req.nextUrl.origin);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
});
