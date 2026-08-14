// ============================================================
// FILE INI = "JEMBATAN" DARI KODE BACKEND (SERVER) KE DATABASE
// ============================================================
// Dipakai di kode yang jalan di SERVER, bukan di browser user.
// Contoh: waktu Dashboard butuh ambil data ringkasan sebelum
// halaman ditampilkan ke user (biar lebih cepat & aman).
//
// Bedanya sama supabase-client.ts:
// - supabase-client.ts -> jalan di browser user (client component)
// - supabase-server.ts -> jalan di server Next.js (server component)
//
// Next.js App Router defaultnya server component, jadi file ini
// yang paling sering dipakai buat "ambil data" di halaman-halaman.

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Bisa diabaikan kalau dipanggil dari Server Component
            // (cookie tetap ke-refresh lewat middleware.ts)
          }
        },
      },
    }
  );
}
