// ============================================================
// LIB: KASBON (fungsi-fungsi untuk fitur Kasbon)
// ============================================================
// Dipakai di halaman Kasbon (app/kasbon/page.tsx). Fitur ini
// OPSIONAL sesuai konsep awal — cuma dipakai kalau owner memang
// ada pelanggan yang ngutang.
//
// MIGRATION YANG PERLU DIJALANIN DULU DI SUPABASE (kolom
// `dibayarkan` belum ada di tabel `kasbon` yang lama):
//
//   alter table kasbon
//     add column dibayarkan numeric not null default 0;
//
// Kolom "Tanggal" di UI TIDAK butuh kolom baru — dia cuma alias
// dari `created_at` yang sudah ada (lihat `.select(...)` di
// bawah, ada `tanggal:created_at`), jadi hasil query otomatis
// punya field bernama `tanggal`.

import { createClient } from "@/lib/supabase-client";

export interface Kasbon {
  id: string;
  nama_pelanggan: string;
  jumlah_utang: number;
  dibayarkan: number;
  status: "belum_lunas" | "lunas";
  tanggal: string; // alias dari created_at, lihat select di bawah
}

// Kolom yang diambil, dipakai bareng di semua query biar konsisten.
const KOLOM_KASBON =
  "id, nama_pelanggan, jumlah_utang, dibayarkan, status, tanggal:created_at";

export async function getDaftarKasbon(): Promise<Kasbon[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kasbon")
    .select(KOLOM_KASBON)
    // Yang "belum_lunas" tampil duluan (urut abjad status taruh
    // "belum_lunas" < "lunas"), baru di dalamnya urut terbaru.
    // Catatan: order tetap pakai nama kolom asli "created_at",
    // alias "tanggal" cuma berlaku di hasil select.
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
  data?: Kasbon;
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

  const { data, error } = await supabase
    .from("kasbon")
    .insert({
      user_id: user.id,
      nama_pelanggan: input.namaPelanggan,
      jumlah_utang: input.jumlahUtang,
      dibayarkan: 0,
      status: "belum_lunas",
    })
    .select(KOLOM_KASBON)
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Gagal menyimpan." };
  }

  return { success: true, data };
}

export interface UpdateKasbonInput {
  dibayarkan: number;
  status: "belum_lunas" | "lunas";
}

// Ganti dari `tandaiLunas` lama — sekarang sekalian bisa update
// jumlah dibayarkan (pembayaran parsial), bukan cuma toggle status.
// Dipanggil dari popup edit di halaman Kasbon.
export async function updateKasbon(
  kasbonId: string,
  input: UpdateKasbonInput
): Promise<HasilKasbon> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("kasbon")
    .update({
      dibayarkan: input.dibayarkan,
      status: input.status,
    })
    .eq("id", kasbonId)
    .select(KOLOM_KASBON)
    .single();

  if (error || !data) {
    return { success: false, error: error?.message ?? "Gagal menyimpan." };
  }

  return { success: true, data };
}
