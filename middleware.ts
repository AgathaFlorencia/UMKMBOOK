// ============================================================
// FILE INI = "PENJAGA PINTU" YANG JALAN DI SETIAP REQUEST
// ============================================================
// Fungsinya: mengecek & memperpanjang session login user secara
// otomatis di background, supaya user gak perlu login ulang
// terus-menerus tiap buka halaman baru.
//
// Kalau nanti mau bikin proteksi "halaman ini hanya bisa diakses
// kalau sudah login" (misal Dashboard, Catat Transaksi), logic-nya
// juga ditaruh di sini.

import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

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
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
