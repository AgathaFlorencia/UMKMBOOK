// ============================================================
// LIB: PROFIL (data usaha milik user yang sedang login)
// ============================================================
import { createClient } from "@/lib/supabase-client";

export interface ProfilToko {
  namaUsaha: string;
}

export async function getProfilToko(): Promise<ProfilToko | null> {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("usaha")
    .select("nama_usaha")
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    console.error("Gagal ambil profil usaha:", error?.message);
    return null;
  }

  return { namaUsaha: data.nama_usaha };
}