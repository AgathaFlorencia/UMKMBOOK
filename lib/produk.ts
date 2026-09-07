// ============================================================
// LIB: PRODUK (fungsi-fungsi untuk fitur Daftar Produk)
// ============================================================
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

export interface HasilHapusProduk {
  success: boolean;
  error?: string;
}

// PENTING: sama seperti update, hapus produk di sini TIDAK
// menghapus transaksi yang sudah tercatat, karena transaksi
// menyimpan datanya sendiri (nama & harga saat itu) secara
// terpisah dari tabel "produk".
export async function deleteProduk(
  produkId: string
): Promise<HasilHapusProduk> {
  const supabase = createClient();

  const { error } = await supabase
    .from("produk")
    .delete()
    .eq("id", produkId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}