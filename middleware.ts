// ============================================================
// FILE INI = "PENJAGA PINTU" YANG JALAN DI SETIAP REQUEST
// ============================================================
// Fungsinya ada 2:
// 1. Mengecek & memperpanjang session login user secara otomatis
//    di background, supaya user gak perlu login ulang terus.
// 2. PROTEKSI HALAMAN — kalau user belum login dan coba akses
//    halaman yang butuh login (Dashboard, Transaksi, dll),
//    otomatis dilempar ke /login. Ini satu-satunya tempat aturan
//    proteksi ditulis, jadi berlaku ke SEMUA halaman sekaligus
//    (gak perlu ditulis ulang manual di tiap file page.tsx).

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Halaman KHUSUS TAMU (belum login): /login dan /onboarding.
// Kalau user yang SUDAH login coba buka halaman ini, otomatis
// dilempar ke Dashboard (gak masuk akal orang yang udah login
// disuruh login lagi).
const GUEST_ONLY_ROUTES = ["/login", "/onboarding"];

// Halaman yang BOLEH diakses SIAPA SAJA, baik sudah login maupun
// belum — TIDAK di-redirect ke mana-mana.
const ALWAYS_PUBLIC_ROUTES = ["/about", "/contact"];

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Ini yang bikin session tetap "fresh" di setiap request
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isGuestOnlyRoute = GUEST_ONLY_ROUTES.includes(pathname);
  const isAlwaysPublicRoute = ALWAYS_PUBLIC_ROUTES.includes(pathname);

  // Belum login + buka halaman yang butuh login -> lempar ke /login
  if (!user && !isGuestOnlyRoute && !isAlwaysPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Sudah login tapi malah buka /login atau /onboarding -> lempar ke Dashboard
  if (user && isGuestOnlyRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};