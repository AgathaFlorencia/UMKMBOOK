"use client";

import { useEffect, useRef, useState } from "react";
import { getProfilToko, updateProfilToko, type ProfilToko } from "@/lib/profil";

const JENIS_USAHA_UMUM = ["Warung / Kuliner", "Laundry", "Reseller / Online Shop", "Lainnya"];

const DURASI_PESAN_SUKSES_MS = 3000;

export default function PengaturanPage() {
  const [namaUsaha, setNamaUsaha] = useState("");
  const [jenisUsaha, setJenisUsaha] = useState("");
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ambil data profil toko yang sudah tersimpan
  useEffect(() => {
    getProfilToko().then((profil: ProfilToko) => {
      setNamaUsaha(profil.nama_usaha ?? "");
      setJenisUsaha(profil.jenis_usaha ?? "");
      setLoadingData(false);
    });
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSukses(false);
    setSaving(true);

    const hasil = await updateProfilToko({ namaUsaha, jenisUsaha });

    setSaving(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Gagal menyimpan, coba lagi.");
      return;
    }

    setSukses(true);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSukses(false), DURASI_PESAN_SUKSES_MS);
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6"
      aria-label="Halaman Pengaturan"
    >
      <form
        className="flex w-full max-w-[446px] flex-col items-center overflow-hidden rounded-2xl bg-white"
        onSubmit={handleSubmit}
        noValidate
      >
        <header className="flex w-full items-center justify-center bg-[#081937] px-6 py-5">
          <h1 className="[font-family:'Inter-SemiBold',Helvetica] text-[32px] font-semibold text-white sm:text-[40px]">
            Pengaturan
          </h1>
        </header>

        <div className="flex w-full flex-col gap-5 px-6 pt-6">
          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Nama usaha</span>
            <input
              className="h-full w-full bg-transparent [font-family:'Poppins-Regular',Helvetica] text-base text-[#848484] outline-none placeholder:text-[#848484]"
              type="text"
              value={namaUsaha}
              onChange={(e) => setNamaUsaha(e.target.value)}
              placeholder={loadingData ? "Memuat..." : "Nama usaha"}
              disabled={loadingData}
              autoComplete="off"
              required
            />
          </label>

          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Jenis usaha</span>
            <select
              className="h-full w-full bg-transparent [font-family:'Poppins-Regular',Helvetica] text-base text-[#848484] outline-none"
              value={jenisUsaha}
              onChange={(e) => setJenisUsaha(e.target.value)}
              disabled={loadingData}
              required
            >
              <option value="" disabled>
                Pilih jenis usaha
              </option>
              {JENIS_USAHA_UMUM.map((jenis) => (
                <option key={jenis} value={jenis}>
                  {jenis}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && (
          <p className="mt-4 px-6 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {sukses && (
          <p
            className="mt-4 rounded-lg bg-[#e7f6ec] px-4 py-2 text-sm font-semibold text-[#1f8a44]"
            role="status"
          >
            Perubahan berhasil disimpan
          </p>
        )}

        <button
          className="my-6 flex h-[47px] w-[149px] items-center justify-center rounded-[10px] bg-[#081937] disabled:opacity-50"
          type="submit"
          disabled={saving || loadingData}
        >
          <span className="[font-family:'Poppins-SemiBold',Helvetica] text-xl font-semibold text-[#ffb800]">
            {saving ? "Menyimpan..." : "Simpan"}
          </span>
        </button>
      </form>
    </main>
  );
}