// ============================================================
// LIB: DASHBOARD (ringkasan HARI INI — arus kas harian)
// ============================================================
// Dipakai di halaman Dashboard buat nampilin snapshot cepat kas
// masuk/keluar HARI INI saja. Beda dengan lib/laporan.ts yang
// menghitung untuk PERIODE yang dipilih user (bisa satu hari
// tertentu atau rentang berhari-hari/berbulan-bulan).
//
// Dashboard sekarang "use client" (karena ada filter tanggal
// interaktif), jadi file ini pakai lib/supabase-client.ts.

import { createClient } from "@/lib/supabase-client";

export interface RingkasanHariIni {
  totalMasuk: number;
  totalKeluar: number;
  untung: number;
}

export async function getRingkasanHariIni(): Promise<RingkasanHariIni> {
  const supabase = createClient();
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
    if (row.jenis === "jual") totalMasuk += row.total;
    else if (row.jenis === "beli") totalKeluar += row.total;
  }

  return { totalMasuk, totalKeluar, untung: totalMasuk - totalKeluar };
}