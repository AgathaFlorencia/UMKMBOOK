// ============================================================
// HALAMAN: ONBOARDING (/onboarding)
// ============================================================
// Dipakai SEKALI DOANG waktu user baru pertama daftar.
// Alurnya: Sign Up (email + password) -> lanjut isi nama usaha
// + jenis usaha -> data disimpan ke tabel "usaha" yang nempel
// ke user_id yang baru dibuat.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [error, setError] = useState("");

  async function handleDaftar(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // 1. Bikin akun baru di Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    // 2. Simpan data usaha, nempel ke user_id yang baru dibuat
    const userId = data.user?.id;
    if (userId) {
      const { error: insertError } = await supabase.from("usaha").insert({
        user_id: userId,
        nama_usaha: namaUsaha,
        jenis_usaha: jenisUsaha,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }
    }

    router.push("/"); // selesai onboarding -> masuk Dashboard
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleDaftar} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Daftar UMKMBook</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Nama usaha (contoh: Warung Bu Siti)"
          className="w-full border rounded-lg p-3"
          value={namaUsaha}
          onChange={(e) => setNamaUsaha(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Jenis usaha (contoh: Warung makan)"
          className="w-full border rounded-lg p-3"
          value={jenisUsaha}
          onChange={(e) => setJenisUsaha(e.target.value)}
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg font-medium"
        >
          Daftar
        </button>
      </form>
    </main>
  );
}
