// ============================================================
// LIB: DASHBOARD (fungsi ringkasan hari ini)
// ============================================================
// Dipakai di halaman Dashboard (app/page.tsx) buat nampilin
// total masuk, total keluar, dan untung hari ini.
//
// Dashboard adalah "server component" (bukan "use client"), jadi
// file ini pakai lib/supabase-server.ts, BEDA dengan lib/transaksi.ts
// dan lib/produk.ts yang dipakai dari komponen client.

import { createClient } from "@/lib/supabase-server";

export interface RingkasanHariIni {
  totalMasuk: number;
  totalKeluar: number;
  untung: number;
}

export async function getRingkasanHariIni(): Promise<RingkasanHariIni> {
  const supabase = await createClient();

  // Format tanggal hari ini jadi "YYYY-MM-DD" sesuai tipe kolom
  // "tanggal" (date) di tabel transaksi.
  const hariIni = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("transaksi")
    .select("jenis, total")
    .eq("tanggal", hariIni);

  if (error || !data) {
    console.error("Gagal ambil ringkasan hari ini:", error?.message);
    return { totalMasuk: 0, totalKeluar: 0, untung: 0 };
  }

  let totalMasuk = 0;
  let totalKeluar = 0;

  for (const row of data) {
    if (row.jenis === "jual") {
      totalMasuk += row.total;
    } else if (row.jenis === "beli") {
      totalKeluar += row.total;
    }
  }

  return {
    totalMasuk,
    totalKeluar,
    untung: totalMasuk - totalKeluar,
  };
}