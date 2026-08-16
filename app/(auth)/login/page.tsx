// ============================================================
// HALAMAN: LOGIN (/login)
// ============================================================
// Form email + password. Ini "client component" (ada tanda
// "use client" di baris paling atas) karena butuh interaksi
// user (ngetik, klik submit) yang jalan di browser.
//
// Makanya di sini pakai supabase-client.ts, bukan supabase-server.ts.

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/"); // berhasil login -> lempar ke Dashboard
    router.refresh();
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Masuk ke UMKMBook</h1>

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

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-black text-white p-3 rounded-lg font-medium"
        >
          Masuk
        </button>

        <p className="text-sm text-center">
          Belum punya akun?{" "}
          <a href="/onboarding" className="underline">
            Daftar di sini
          </a>
        </p>
      </form>
    </main>
  );
}
