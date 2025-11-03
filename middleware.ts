import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const url = req.nextUrl;
  const pathname = url.pathname;

  // 🔒 Redirect unauthenticated users to login
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🧭 Define admin-only paths
  const adminPaths = ["/admin/user", "/admin/surat-keluar"];

  const isAdminPath = adminPaths.some((path) => pathname.startsWith(path));

  // 🟡 Allow user to edit only their own user page
  const editUserMatch = pathname.match(/^\/admin\/user\/([^/]+)\/edit$/);
  if (editUserMatch) {
    const requestedUserId = editUserMatch[1];
    if (requestedUserId === token.id || token.isAdmin || token.isSuperAdmin) {
      return NextResponse.next();
    }
  }

  // 📨 Special case: surat-masuk
  const isSuratMasukPath = pathname.startsWith("/admin/surat-masuk");

  if (isSuratMasukPath) {
    const isRootPage = pathname === "/admin/surat-masuk";

    // Allow everyone to access /admin/surat-masuk
    if (isRootPage) {
      return NextResponse.next();
    }

    // Only admins can access subpages like /tambah or /[id]/edit
    if (!token.isAdmin && !token.isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin/surat-masuk", req.url));
    }
  }

  // 🚫 Restrict admin paths (user, surat-keluar) to Admins/SuperAdmins
  if (isAdminPath) {
    if (!token.isAdmin && !token.isSuperAdmin) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
  }

  // ✅ Otherwise allow access
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
