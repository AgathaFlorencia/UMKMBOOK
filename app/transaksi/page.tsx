// ============================================================
// HALAMAN: CATAT TRANSAKSI (/transaksi)
// ============================================================
// Halaman PALING SERING dipakai user. Pilih "Jual" atau
// "Beli/Keluar", lalu isi nama produk + harga + jumlah.
//
// Ingat prinsip dari konsep UMKMBook:
// - Produk gak perlu ada dulu di database. Kalau nama produk
//   yang diketik belum pernah ada, otomatis dibikin baru
//   (logic ini nanti ditaruh di sini, saat submit).
// - Harga yang disimpan adalah harga SAAT transaksi ini terjadi,
//   bukan "nempel" ke harga produk yang mungkin berubah nanti.

"use client";

import { useState } from "react";

export default function TransaksiPage() {
  const [jenis, setJenis] = useState<"jual" | "beli">("jual");

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Catat Transaksi</h1>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setJenis("jual")}
          className={`px-4 py-2 rounded-lg ${
            jenis === "jual" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Jual
        </button>
        <button
          onClick={() => setJenis("beli")}
          className={`px-4 py-2 rounded-lg ${
            jenis === "beli" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Beli / Keluar
        </button>
      </div>

      {/* TODO: form input nama produk, harga, jumlah, satuan.
          Saat submit -> insert ke tabel "transaksi" via
          lib/supabase-client.ts, dan cek/insert ke tabel
          "produk" kalau nama produknya baru. */}
      <p className="text-gray-500">
        Form input transaksi ({jenis}) — dikembangkan di sini.
      </p>
    </main>
  );
}
