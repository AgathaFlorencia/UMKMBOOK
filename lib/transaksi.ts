// ============================================================
// LIB: TRANSAKSI (fungsi-fungsi untuk fitur Catat Transaksi)
// ============================================================
// File ini isinya "logic backend" untuk transaksi. Temen kamu
// (frontend) tinggal panggil fungsi catatTransaksi(...) dari
// halaman UI, tanpa perlu tahu detail Supabase-nya.
//
// Alur di dalam catatTransaksi():
// 1. Cek: apakah produk dengan nama ini sudah ada di tabel "produk"?
// 2a. Kalau BELUM ada -> buat produk baru dengan harga yang diinput.
// 2b. Kalau SUDAH ada -> pakai produk itu (harga di tabel produk
//     TIDAK diubah otomatis di sini, itu urusan halaman Produk).
// 3. Simpan transaksi baru, dengan harga_saat_transaksi = harga
//    yang diinput SEKARANG (bukan ambil dari produk.harga_terbaru).
//    Ini yang menjaga prinsip "harga historis tidak berubah".

import { createClient } from "@/lib/supabase-client";

export type JenisTransaksi = "jual" | "beli";

export interface InputTransaksi {
  namaProduk: string;
  jenis: JenisTransaksi;
  harga: number;
  jumlah: number;
  satuan: string;
}

export interface HasilTransaksi {
  success: boolean;
  error?: string;
}

export async function catatTransaksi(
  input: InputTransaksi
): Promise<HasilTransaksi> {
  const supabase = createClient();

  // Ambil user yang sedang login
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kamu belum login." };
  }

  // 1. Cek apakah produk dengan nama ini sudah ada
  const { data: produkExisting, error: cariError } = await supabase
    .from("produk")
    .select("id")
    .eq("user_id", user.id)
    .eq("nama_produk", input.namaProduk)
    .maybeSingle();

  if (cariError) {
    return { success: false, error: cariError.message };
  }

  let produkId: string;

  if (produkExisting) {
    // 2a. Produk sudah ada, pakai id yang sudah ada
    produkId = produkExisting.id;
  } else {
    // 2b. Produk belum ada, buat baru
    const { data: produkBaru, error: insertProdukError } = await supabase
      .from("produk")
      .insert({
        user_id: user.id,
        nama_produk: input.namaProduk,
        satuan: input.satuan,
        harga_terbaru: input.harga,
      })
      .select("id")
      .single();

    if (insertProdukError || !produkBaru) {
      return {
        success: false,
        error: insertProdukError?.message ?? "Gagal membuat produk baru.",
      };
    }

    produkId = produkBaru.id;
  }

  // 3. Simpan transaksi, dengan harga SNAPSHOT (bukan ambil dari
  // tabel produk), supaya transaksi lama tidak berubah kalau
  // harga produk nanti diupdate.
  const { error: insertTransaksiError } = await supabase
    .from("transaksi")
    .insert({
      user_id: user.id,
      produk_id: produkId,
      jenis: input.jenis,
      nama_produk: input.namaProduk,
      harga_saat_transaksi: input.harga,
      jumlah: input.jumlah,
      satuan: input.satuan,
    });

  if (insertTransaksiError) {
    return { success: false, error: insertTransaksiError.message };
  }

  return { success: true };
}