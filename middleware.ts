import { NextRequest, NextResponse } from "next/server";

function unauthorized() {
  return new NextResponse("Autenticação necessária.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Inventario TI"',
      "Cache-Control": "no-store",
    },
  });
}

export function middleware(request: NextRequest) {
  const requireAuth = process.env.APP_REQUIRE_AUTH === "true";

  if (!requireAuth) {
    return NextResponse.next();
  }

  const expectedUser = process.env.APP_BASIC_USER;
  const expectedPassword = process.env.APP_BASIC_PASSWORD;

  if (!expectedUser || !expectedPassword) {
    return new NextResponse("Proteção não configurada.", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(authHeader.slice("Basic ".length));
    const separatorIndex = decoded.indexOf(":");

    if (separatorIndex < 0) {
      return unauthorized();
    }

    const inputUser = decoded.slice(0, separatorIndex);
    const inputPassword = decoded.slice(separatorIndex + 1);

    if (inputUser === expectedUser && inputPassword === expectedPassword) {
      return NextResponse.next();
    }

    return unauthorized();
  } catch {
    return unauthorized();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
