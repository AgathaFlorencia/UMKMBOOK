// ============================================================
// HALAMAN: PENGATURAN (/pengaturan)
// ============================================================
// Konfigurasi akun & data usaha (nama usaha, jenis usaha),
// serta tombol logout.

"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function PengaturanPage() {
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Pengaturan</h1>
      {/* TODO: form edit nama usaha & jenis usaha */}
      <button
        onClick={handleLogout}
        className="border border-red-500 text-red-500 px-4 py-2 rounded-lg"
      >
        Keluar
      </button>
    </main>
  );
}
