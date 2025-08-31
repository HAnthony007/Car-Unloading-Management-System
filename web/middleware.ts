import { type NextRequest, NextResponse } from "next/server";

// Hybrid approach:
// 1) If client set a lightweight marker cookie (app_auth=1), allow.
// 2) Else try backend /auth/me with forwarded cookies; allow on 200, redirect on 403.
// 3) For 401/419 or network issues (common with cross-domain Sanctum), allow and let the client guard handle it.
const AUTH_MARKER = "app_auth";
const API_BASE = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;

export async function middleware(request: NextRequest) {
  const url = new URL("/login", request.url);
  url.searchParams.set(
    "from",
    request.nextUrl.pathname + request.nextUrl.search,
  );
  url.searchParams.set("reason", "unauthenticated");

  const marker = request.cookies.get(AUTH_MARKER)?.value;
  if (marker === "1") {
    return NextResponse.next();
  }

  if (!API_BASE) return NextResponse.next();

  try {
    const cookie = request.headers.get("cookie") ?? "";
    const res = await fetch(`${API_BASE}/auth/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "X-Requested-With": "XMLHttpRequest",
        ...(cookie ? { Cookie: cookie } : {}),
      },
      cache: "no-store",
    });

    if (res.ok) return NextResponse.next();
    if (res.status === 403) {
      url.searchParams.set("reason", "forbidden");
      return NextResponse.redirect(url);
    }
    // 401/419 or anything else: allow and let client guard decide
    return NextResponse.next();
  } catch {
    // Backend not reachable: allow and let client guard decide
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
