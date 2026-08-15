// ============================================================
// LIB: RIWAYAT (fungsi ambil semua transaksi milik user)
// ============================================================
// Dipakai di halaman Riwayat Transaksi (app/riwayat/page.tsx).
// Ini "server component" juga, jadi pakai lib/supabase-server.ts,
// sama seperti lib/dashboard.ts.

import { createClient } from "@/lib/supabase-server";

export interface RiwayatItem {
  id: string;
  jenis: "jual" | "beli";
  nama_produk: string;
  harga_saat_transaksi: number;
  jumlah: number;
  satuan: string;
  total: number;
  tanggal: string;
}

export async function getRiwayatTransaksi(): Promise<RiwayatItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transaksi")
    .select(
      "id, jenis, nama_produk, harga_saat_transaksi, jumlah, satuan, total, tanggal"
    )
    // Urutkan dari yang terbaru: tanggal terbaru dulu, lalu di
    // dalam tanggal yang sama urutkan dari yang baru dibuat.
    .order("tanggal", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("Gagal ambil riwayat transaksi:", error?.message);
    return [];
  }

  return data;
}