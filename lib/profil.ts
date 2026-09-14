// ============================================================
// LIB: PROFIL TOKO (fungsi-fungsi untuk fitur Pengaturan)
// ============================================================
import { createClient } from "@/lib/supabase-client";

export interface ProfilToko {
  nama_usaha: string;
  jenis_usaha: string;
}

// Profil kosong dipakai sebagai fallback kalau user belum pernah
// isi profil tokonya sama sekali (baris di tabel belum ada).
const PROFIL_KOSONG: ProfilToko = {
  nama_usaha: "",
  jenis_usaha: "",
};

export async function getProfilToko(): Promise<ProfilToko> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Gagal ambil profil toko: user belum login.");
    return PROFIL_KOSONG;
  }

  const { data, error } = await supabase
    .from("usaha")
    .select("nama_usaha, jenis_usaha")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    console.error("Gagal ambil profil toko:", error.message);
    return PROFIL_KOSONG;
  }

  return data ?? PROFIL_KOSONG;
}

export interface UpdateProfilTokoInput {
  namaUsaha: string;
  jenisUsaha: string;
}

export interface HasilUpdateProfilToko {
  success: boolean;
  error?: string;
}

// Pakai upsert, bukan update biasa — soalnya user bisa aja belum
// pernah punya baris di tabel ini sama sekali. Kalau baris
// "user_id" = user.id belum ada, upsert otomatis bikin baru;
// kalau udah ada, tinggal diupdate.
export async function updateProfilToko(
  input: UpdateProfilTokoInput
): Promise<HasilUpdateProfilToko> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User belum login." };
  }

  // Cek dulu apakah user ini sudah punya baris di tabel "usaha"
  const { data: existing, error: selectError } = await supabase
    .from("usaha")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (selectError) {
    return { success: false, error: selectError.message };
  }

  const { error } = existing
    ? await supabase
        .from("usaha")
        .update({
          nama_usaha: input.namaUsaha,
          jenis_usaha: input.jenisUsaha,
        })
        .eq("user_id", user.id)
    : await supabase.from("usaha").insert({
        user_id: user.id,
        nama_usaha: input.namaUsaha,
        jenis_usaha: input.jenisUsaha,
      });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}