import { NextRequest, NextResponse } from "next/server";

// Precisa bater com ADMIN_SESSION_COOKIE em lib/adminAuth.ts.
const ADMIN_SESSION_COOKIE = "belfort_admin_session";

// Checagem otimista (só confere se o cookie existe) — a validação real do token acontece no
// backend a cada chamada aos Route Handlers em app/api/admin/**, que retornam 401 se expirado.
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const hasSession = request.cookies.has(ADMIN_SESSION_COOKIE);
  if (!hasSession) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
