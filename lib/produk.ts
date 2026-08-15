// ============================================================
// LIB: PRODUK (fungsi-fungsi untuk fitur Daftar Produk)
// ============================================================
// File ini isinya fungsi buat ngambil & ngubah data produk milik
// user yang sedang login. Dipakai di halaman /transaksi (buat
// dropdown/autofill) dan halaman /produk (buat kelola produk).

import { createClient } from "@/lib/supabase-client";

export interface Produk {
  id: string;
  nama_produk: string;
  satuan: string;
  harga_terbaru: number;
  modal_per_unit: number | null;
}

export async function getDaftarProduk(): Promise<Produk[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("produk")
    .select("id, nama_produk, satuan, harga_terbaru, modal_per_unit")
    .order("nama_produk", { ascending: true });

  if (error) {
    console.error("Gagal ambil daftar produk:", error.message);
    return [];
  }

  return data ?? [];
}

export interface UpdateProdukInput {
  hargaTerbaru: number;
  modalPerUnit: number | null;
}

export interface HasilUpdateProduk {
  success: boolean;
  error?: string;
}

// PENTING: fungsi ini cuma mengubah data di tabel "produk".
// Transaksi yang SUDAH tercatat sebelumnya TIDAK ikut berubah,
// karena transaksi punya kolom harga_saat_transaksi sendiri
// (lihat lib/transaksi.ts). Jadi update di sini hanya berlaku
// untuk transaksi BARU ke depan.
export async function updateProduk(
  produkId: string,
  input: UpdateProdukInput
): Promise<HasilUpdateProduk> {
  const supabase = createClient();

  const { error } = await supabase
    .from("produk")
    .update({
      harga_terbaru: input.hargaTerbaru,
      modal_per_unit: input.modalPerUnit,
    })
    .eq("id", produkId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}