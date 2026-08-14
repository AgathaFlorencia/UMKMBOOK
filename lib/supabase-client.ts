// ============================================================
// FILE INI = "JEMBATAN" DARI KODE FRONTEND KE DATABASE SUPABASE
// ============================================================
// Dipakai di komponen yang jalan di BROWSER (client component),
// contohnya form input transaksi, tombol submit, dll.
// Kalau butuh akses database dari kode yang jalan di browser
// (misal: "onClick", "onSubmit"), pakai file ini.

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
