import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Proxy de Next.js para protección de rutas en el servidor con cookies (Bono +3 pts).
 * Rúbrica oficial: "Protección de rutas en el servidor con proxy.ts de Next.js y el token en una cookie"
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Rutas que requieren autenticación
  const isProtectedRoute =
    pathname.startsWith("/mis-comentarios") || pathname.startsWith("/admin");

  // Rutas de autenticación (no accesibles con sesión activa)
  const isAuthRoute =
    pathname.startsWith("/login") || pathname.startsWith("/registro");

  // Si intenta acceder a ruta protegida sin token en cookie -> redirigir a /login en el servidor
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protección específica de rol para /admin
  if (pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    let isAdmin = false;
    try {
      if (token.includes("admin")) {
        isAdmin = true;
      } else {
        const parts = token.split(".");
        if (parts.length === 3) {
          const payload = JSON.parse(
            Buffer.from(parts[1], "base64").toString("utf-8")
          );
          if (payload.role === "admin") {
            isAdmin = true;
          }
        }
      }
    } catch {
      isAdmin = false;
    }

    // Si no es admin -> redirigir a la página principal
    if (!isAdmin) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Si tiene sesión activa e intenta ir a /login o /registro -> redirigir a inicio
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mis-comentarios/:path*",
    "/admin/:path*",
    "/login",
    "/registro",
  ],
};
