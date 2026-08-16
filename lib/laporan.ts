// ============================================================
// LIB: LAPORAN (ringkasan bulanan + produk terlaris)
// ============================================================
// Dipakai di halaman Laporan (app/laporan/page.tsx). Ini yang
// menjawab concern "untung harian itu timpang buat usaha yang
// belanja bahan sekali di awal bulan" — laporan di sini menghitung
// dalam rentang SEBULAN PENUH, jadi pembelian besar di awal bulan
// "terserap" oleh penjualan harian sepanjang bulan itu.

import { createClient } from "@/lib/supabase-server";

// ------------------------------------------------------------
// Bagian 1: Ringkasan untung-rugi bulan ini vs bulan lalu
// ------------------------------------------------------------

export interface RingkasanBulanan {
  totalMasuk: number;
  totalKeluar: number;
  untungBulanIni: number;
  untungBulanLalu: number;
  persentasePerubahan: number | null; // null kalau bulan lalu belum ada data
}

function formatTanggal(d: Date): string {
  return d.toISOString().split("T")[0];
}

// Ambil batas awal & akhir suatu bulan (offset 0 = bulan ini,
// -1 = bulan lalu, dst), dalam format "YYYY-MM-DD".
function rentangBulan(offsetBulan: number) {
  const sekarang = new Date();
  const awal = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth() + offsetBulan,
    1
  );
  const akhir = new Date(
    sekarang.getFullYear(),
    sekarang.getMonth() + offsetBulan + 1,
    1
  );
  return { awal: formatTanggal(awal), akhir: formatTanggal(akhir) };
}

async function totalUntungPeriode(
  awal: string,
  akhir: string
): Promise<{ totalMasuk: number; totalKeluar: number }> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transaksi")
    .select("jenis, total")
    .gte("tanggal", awal)
    .lt("tanggal", akhir);

  if (error || !data) {
    console.error("Gagal ambil data laporan:", error?.message);
    return { totalMasuk: 0, totalKeluar: 0 };
  }

  let totalMasuk = 0;
  let totalKeluar = 0;
  for (const row of data) {
    if (row.jenis === "jual") totalMasuk += row.total;
    else if (row.jenis === "beli") totalKeluar += row.total;
  }

  return { totalMasuk, totalKeluar };
}

export async function getRingkasanBulanan(): Promise<RingkasanBulanan> {
  const bulanIni = rentangBulan(0);
  const bulanLalu = rentangBulan(-1);

  const [dataBulanIni, dataBulanLalu] = await Promise.all([
    totalUntungPeriode(bulanIni.awal, bulanIni.akhir),
    totalUntungPeriode(bulanLalu.awal, bulanLalu.akhir),
  ]);

  const untungBulanIni = dataBulanIni.totalMasuk - dataBulanIni.totalKeluar;
  const untungBulanLalu = dataBulanLalu.totalMasuk - dataBulanLalu.totalKeluar;

  let persentasePerubahan: number | null = null;
  if (untungBulanLalu !== 0) {
    persentasePerubahan =
      ((untungBulanIni - untungBulanLalu) / Math.abs(untungBulanLalu)) * 100;
  }

  return {
    totalMasuk: dataBulanIni.totalMasuk,
    totalKeluar: dataBulanIni.totalKeluar,
    untungBulanIni,
    untungBulanLalu,
    persentasePerubahan,
  };
}

// ------------------------------------------------------------
// Bagian 2: Produk terlaris bulan ini (+ margin untuk reseller)
// ------------------------------------------------------------

export interface ProdukTerlaris {
  namaProduk: string;
  satuan: string;
  jumlahTerjual: number;
  omzet: number; // total pendapatan dari produk ini
  margin: number | null; // null kalau modal_per_unit belum diisi
}

// Tipe bantu buat proses pengelompokan di dalam fungsi di bawah
interface KelompokProduk {
  satuan: string;
  jumlahTerjual: number;
  omzet: number;
}

export async function getProdukTerlaris(): Promise<ProdukTerlaris[]> {
  const supabase = await createClient();
  const { awal, akhir } = rentangBulan(0);

  // Ambil semua transaksi JUAL bulan ini
  const { data: transaksiBulanIni, error: errTransaksi } = await supabase
    .from("transaksi")
    .select("nama_produk, satuan, jumlah, total")
    .eq("jenis", "jual")
    .gte("tanggal", awal)
    .lt("tanggal", akhir);

  if (errTransaksi || !transaksiBulanIni) {
    console.error("Gagal ambil transaksi untuk produk terlaris:", errTransaksi?.message);
    return [];
  }

  // Ambil modal_per_unit tiap produk (buat hitung margin)
  const { data: daftarProduk } = await supabase
    .from("produk")
    .select("nama_produk, modal_per_unit");

  const modalMap = new Map<string, number | null>();
  for (const p of daftarProduk ?? []) {
    modalMap.set(p.nama_produk, p.modal_per_unit);
  }

  // Kelompokkan transaksi per nama produk
  const kelompok = new Map<string, KelompokProduk>();

  for (const t of transaksiBulanIni) {
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

  // Urutkan dari yang paling laris (jumlah terjual terbanyak)
  hasil.sort((a, b) => b.jumlahTerjual - a.jumlahTerjual);

  return hasil.slice(0, 5); // ambil 5 teratas
}