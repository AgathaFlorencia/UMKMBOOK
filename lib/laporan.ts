// ============================================================
// LIB: LAPORAN (ringkasan & insight untuk PERIODE yang dipilih)
// ============================================================
// Dipakai di halaman Dashboard, bagian filter tanggal. Beda
// dengan lib/dashboard.ts yang selalu "hari ini", semua fungsi
// di sini menerima rentang tanggal (awal, akhir) dari filter
// yang dipilih user — bisa satu tanggal spesifik (awal = akhir
// sama) atau rentang beberapa hari/bulan.

import { createClient } from "@/lib/supabase-client";

// ------------------------------------------------------------
// Bagian 1: Ringkasan angka untuk periode yang difilter
// ------------------------------------------------------------

export interface RingkasanPeriode {
  totalMasuk: number;
  totalKeluar: number;
  untung: number;
  jumlahTransaksi: number;
  totalProdukTerjual: number;
}

export async function getRingkasanPeriode(
  awal: string,
  akhir: string
): Promise<RingkasanPeriode> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transaksi")
    .select("jenis, total, jumlah")
    .gte("tanggal", awal)
    .lte("tanggal", akhir);

  if (error || !data) {
    console.error("Gagal ambil ringkasan periode:", error?.message);
    return {
      totalMasuk: 0,
      totalKeluar: 0,
      untung: 0,
      jumlahTransaksi: 0,
      totalProdukTerjual: 0,
    };
  }

  let totalMasuk = 0;
  let totalKeluar = 0;
  let totalProdukTerjual = 0;

  for (const row of data) {
    if (row.jenis === "jual") {
      totalMasuk += row.total;
      totalProdukTerjual += row.jumlah;
    } else if (row.jenis === "beli") {
      totalKeluar += row.total;
    }
  }

  return {
    totalMasuk,
    totalKeluar,
    untung: totalMasuk - totalKeluar,
    jumlahTransaksi: data.length,
    totalProdukTerjual,
  };
}

// ------------------------------------------------------------
// Bagian 2: Data grafik penjualan harian dalam periode
// ------------------------------------------------------------

export interface TitikGrafikHarian {
  tanggal: string;
  totalMasuk: number;
}

export async function getGrafikPenjualanHarian(
  awal: string,
  akhir: string
): Promise<TitikGrafikHarian[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("transaksi")
    .select("tanggal, total")
    .eq("jenis", "jual")
    .gte("tanggal", awal)
    .lte("tanggal", akhir)
    .order("tanggal", { ascending: true });

  if (error || !data) {
    console.error("Gagal ambil data grafik:", error?.message);
    return [];
  }

  const perTanggal = new Map<string, number>();
  for (const row of data) {
    perTanggal.set(
      row.tanggal,
      (perTanggal.get(row.tanggal) ?? 0) + row.total
    );
  }

  return Array.from(perTanggal.entries()).map(([tanggal, totalMasuk]) => ({
    tanggal,
    totalMasuk,
  }));
}

// ------------------------------------------------------------
// Bagian 3: Produk terlaris — bisa untuk periode TERTENTU,
// atau ALL-TIME (tanpa filter tanggal sama sekali)
// ------------------------------------------------------------

export interface ProdukTerlaris {
  namaProduk: string;
  satuan: string;
  jumlahTerjual: number;
  omzet: number;
  margin: number | null; // null kalau modal_per_unit belum diisi
}

// Tipe bantu buat proses pengelompokan di dalam fungsi di bawah
interface KelompokProduk {
  satuan: string;
  jumlahTerjual: number;
  omzet: number;
}

// Fungsi inti (dipakai bareng oleh keduanya di bawah).
// awal & akhir null = ambil SEMUA transaksi (all-time).
async function hitungProdukTerlaris(
  awal: string | null,
  akhir: string | null
): Promise<ProdukTerlaris[]> {
  const supabase = createClient();

  let query = supabase
    .from("transaksi")
    .select("nama_produk, satuan, jumlah, total")
    .eq("jenis", "jual");

  if (awal && akhir) {
    query = query.gte("tanggal", awal).lte("tanggal", akhir);
  }

  const { data: transaksiList, error: errTransaksi } = await query;

  if (errTransaksi || !transaksiList) {
    console.error(
      "Gagal ambil transaksi produk terlaris:",
      errTransaksi?.message
    );
    return [];
  }

  const { data: daftarProduk } = await supabase
    .from("produk")
    .select("nama_produk, modal_per_unit");

  const modalMap = new Map<string, number | null>();
  for (const p of daftarProduk ?? []) {
    modalMap.set(p.nama_produk, p.modal_per_unit);
  }

  const kelompok = new Map<string, KelompokProduk>();

  for (const t of transaksiList) {
    const existing = kelompok.get(t.nama_produk);
    if (existing) {
      existing.jumlahTerjual += t.jumlah;
      existing.omzet += t.total;
    } else {
      kelompok.set(t.nama_produk, {
        satuan: t.satuan,
        jumlahTerjual: t.jumlah,
        omzet: t.total,
      });
    }
  }

  const hasil: ProdukTerlaris[] = Array.from(kelompok.entries()).map(
    ([namaProduk, data]) => {
      const modalPerUnit = modalMap.get(namaProduk);
      const margin =
        modalPerUnit != null
          ? data.omzet - modalPerUnit * data.jumlahTerjual
          : null;

      return {
        namaProduk,
        satuan: data.satuan,
        jumlahTerjual: data.jumlahTerjual,
        omzet: data.omzet,
        margin,
      };
    }
  );

  hasil.sort((a, b) => b.jumlahTerjual - a.jumlahTerjual);
  return hasil.slice(0, 5); // ambil 5 teratas
}

// Produk terlaris untuk PERIODE yang lagi difilter user
export async function getProdukTerlarisPeriode(
  awal: string,
  akhir: string
): Promise<ProdukTerlaris[]> {
  return hitungProdukTerlaris(awal, akhir);
}

// Produk terlaris ALL-TIME — TIDAK terpengaruh filter tanggal,
// selalu menghitung dari seluruh riwayat transaksi
export async function getProdukTerlarisAllTime(): Promise<ProdukTerlaris[]> {
  return hitungProdukTerlaris(null, null);
}