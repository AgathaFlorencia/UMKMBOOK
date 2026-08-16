// ============================================================
// LIB: KASBON (fungsi-fungsi untuk fitur Kasbon)
// ============================================================
// Dipakai di halaman Kasbon (app/kasbon/page.tsx). Fitur ini
// OPSIONAL sesuai konsep awal — cuma dipakai kalau owner memang
// ada pelanggan yang ngutang.

import { createClient } from "@/lib/supabase-client";

export interface Kasbon {
  id: string;
  nama_pelanggan: string;
  jumlah_utang: number;
  status: "belum_lunas" | "lunas";
  created_at: string;
}

export async function getDaftarKasbon(): Promise<Kasbon[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kasbon")
    .select("id, nama_pelanggan, jumlah_utang, status, created_at")
    // Yang "belum_lunas" tampil duluan (urut abjad status taruh
    // "belum_lunas" < "lunas"), baru di dalamnya urut terbaru.
    .order("status", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal ambil daftar kasbon:", error.message);
    return [];
  }

  return data ?? [];
}

export interface TambahKasbonInput {
  namaPelanggan: string;
  jumlahUtang: number;
}

export interface HasilKasbon {
  success: boolean;
  error?: string;
}

export async function tambahKasbon(
  input: TambahKasbonInput
): Promise<HasilKasbon> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Kamu belum login." };
  }

  const { error } = await supabase.from("kasbon").insert({
    user_id: user.id,
    nama_pelanggan: input.namaPelanggan,
    jumlah_utang: input.jumlahUtang,
    status: "belum_lunas",
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}

export async function tandaiLunas(kasbonId: string): Promise<HasilKasbon> {
  const supabase = createClient();

  const { error } = await supabase
    .from("kasbon")
    .update({ status: "lunas" })
    .eq("id", kasbonId);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}