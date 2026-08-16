// ============================================================
// HALAMAN: KASBON (/kasbon)
// ============================================================
// Fitur OPSIONAL — pelacak utang pelanggan. Owner bisa nambah
// catatan utang baru, lihat siapa masih ngutang berapa, dan
// tandai "Lunas" kalau sudah dibayar.
//
// "use client" karena ada interaksi tambah data + update status
// langsung di halaman ini.
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

"use client";

import { useEffect, useState } from "react";
import {
  getDaftarKasbon,
  tambahKasbon,
  tandaiLunas,
  type Kasbon,
} from "@/lib/kasbon";
import { formatRupiah } from "@/lib/format";

export default function KasbonPage() {
  const [daftarKasbon, setDaftarKasbon] = useState<Kasbon[]>([]);
  const [loading, setLoading] = useState(true);

  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jumlahUtang, setJumlahUtang] = useState("");
  const [menyimpan, setMenyimpan] = useState(false);
  const [error, setError] = useState("");

  async function muatUlang() {
    const data = await getDaftarKasbon();
    setDaftarKasbon(data);
    setLoading(false);
  }

  useEffect(() => {
    muatUlang();
  }, []);

  async function handleTambah(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMenyimpan(true);

    const hasil = await tambahKasbon({
      namaPelanggan,
      jumlahUtang: parseFloat(jumlahUtang),
    });

    setMenyimpan(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Gagal menyimpan.");
      return;
    }

    setNamaPelanggan("");
    setJumlahUtang("");
    muatUlang();
  }

  async function handleTandaiLunas(id: string) {
    await tandaiLunas(id);
    muatUlang();
  }

  const totalBelumLunas = daftarKasbon
    .filter((k) => k.status === "belum_lunas")
    .reduce((total, k) => total + k.jumlah_utang, 0);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-1">Kasbon</h1>
      <p className="text-sm text-gray-500 mb-6">
        Total belum lunas: {formatRupiah(totalBelumLunas)}
      </p>

      {/* Form tambah kasbon baru */}
      <form
        onSubmit={handleTambah}
        className="max-w-sm space-y-3 mb-8 border rounded-lg p-4"
      >
        <p className="font-medium text-sm">Catat utang baru</p>
        <input
          type="text"
          placeholder="Nama pelanggan"
          className="w-full border rounded-lg p-2"
          value={namaPelanggan}
          onChange={(e) => setNamaPelanggan(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Jumlah utang (Rp)"
          className="w-full border rounded-lg p-2"
          value={jumlahUtang}
          onChange={(e) => setJumlahUtang(e.target.value)}
          required
          min="0"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={menyimpan}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {menyimpan ? "Menyimpan..." : "Tambah Kasbon"}
        </button>
      </form>

      {/* Daftar kasbon */}
      {loading && <p className="text-gray-500">Memuat...</p>}

      {!loading && daftarKasbon.length === 0 && (
        <p className="text-gray-500">Belum ada catatan kasbon.</p>
      )}

      <div className="space-y-2">
        {daftarKasbon.map((k) => (
          <div
            key={k.id}
            className="border rounded-lg p-4 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{k.nama_pelanggan}</p>
              <p className="text-sm text-gray-500">
                {formatRupiah(k.jumlah_utang)}
              </p>
            </div>

            {k.status === "lunas" ? (
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700">
                Lunas
              </span>
            ) : (
              <button
                onClick={() => handleTandaiLunas(k.id)}
                className="text-xs px-3 py-1.5 rounded-lg border border-black"
              >
                Tandai Lunas
              </button>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}