// ============================================================
// HALAMAN: CATAT TRANSAKSI (/transaksi)
// ============================================================
// Halaman PALING SERING dipakai user. Pilih "Jual" atau
// "Beli/Keluar", lalu isi nama produk + harga + jumlah + satuan.
//
// Fitur autofill: nama produk pakai <datalist> (dropdown bawaan
// browser tapi tetap bisa diketik bebas kalau produknya baru).
// Kalau nama yang diketik cocok sama produk yang sudah ada,
// harga & satuan otomatis keisi dari data produk itu (tapi user
// tetap bisa mengubahnya kalau mau harga beda di transaksi ini).
//
// Logic backend-nya (cek/buat produk baru, simpan transaksi
// dengan harga snapshot) ada di lib/transaksi.ts — halaman ini
// cuma manggil fungsi catatTransaksi() dari sana.
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { catatTransaksi, type JenisTransaksi } from "@/lib/transaksi";
import { getDaftarProduk, type Produk } from "@/lib/produk";

// Daftar satuan umum yang selalu muncul di dropdown, biar user
// baru (belum punya produk sama sekali) tetap ada opsi pilihan.
const SATUAN_UMUM = ["porsi", "kg", "gram", "pcs", "pasang", "liter", "box"];

export default function TransaksiPage() {
  const router = useRouter();

  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([]);
  const [jenis, setJenis] = useState<JenisTransaksi>("jual");
  const [namaProduk, setNamaProduk] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil daftar produk sekali waktu halaman dibuka
  useEffect(() => {
    getDaftarProduk().then(setDaftarProduk);
  }, []);

  // Daftar satuan untuk dropdown: gabungan dari satuan yang sudah
  // pernah dipakai + daftar satuan umum, tanpa duplikat.
  const daftarSatuan = Array.from(
    new Set([...daftarProduk.map((p) => p.satuan), ...SATUAN_UMUM])
  );

  // Waktu nama produk berubah, cek apakah namanya cocok dengan
  // produk yang sudah ada -> kalau cocok, autofill harga & satuan.
  function handleNamaProdukChange(value: string) {
    setNamaProduk(value);

    const produkCocok = daftarProduk.find(
      (p) => p.nama_produk.toLowerCase() === value.toLowerCase()
    );

    if (produkCocok) {
      setHarga(String(produkCocok.harga_terbaru));
      setSatuan(produkCocok.satuan);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const hasil = await catatTransaksi({
      namaProduk,
      jenis,
      harga: parseFloat(harga),
      jumlah: parseFloat(jumlah),
      satuan,
    });

    setLoading(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Terjadi kesalahan, coba lagi.");
      return;
    }

    // Berhasil -> balik ke Dashboard
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Catat Transaksi</h1>

      <div className="flex gap-2 mb-6">
        <button
          type="button"
          onClick={() => setJenis("jual")}
          className={`px-4 py-2 rounded-lg ${
            jenis === "jual" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Jual
        </button>
        <button
          type="button"
          onClick={() => setJenis("beli")}
          className={`px-4 py-2 rounded-lg ${
            jenis === "beli" ? "bg-black text-white" : "bg-gray-100"
          }`}
        >
          Beli / Keluar
        </button>
      </div>

      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        {/* Nama produk: dropdown dari produk yang sudah ada,
            TAPI tetap bisa diketik bebas kalau produk baru */}
        <div>
          <input
            type="text"
            list="daftar-nama-produk"
            placeholder="Nama produk/layanan (contoh: Nasi Goreng)"
            className="w-full border rounded-lg p-3"
            value={namaProduk}
            onChange={(e) => handleNamaProdukChange(e.target.value)}
            required
          />
          <datalist id="daftar-nama-produk">
            {daftarProduk.map((p) => (
              <option key={p.id} value={p.nama_produk} />
            ))}
          </datalist>
        </div>

        <input
          type="number"
          placeholder="Harga per satuan (contoh: 15000)"
          className="w-full border rounded-lg p-3"
          value={harga}
          onChange={(e) => setHarga(e.target.value)}
          required
          min="0"
        />
        <input
          type="number"
          placeholder="Jumlah (contoh: 2)"
          className="w-full border rounded-lg p-3"
          value={jumlah}
          onChange={(e) => setJumlah(e.target.value)}
          required
          min="0"
        />

        {/* Satuan: sama, dropdown tapi tetap bisa ketik bebas */}
        <div>
          <input
            type="text"
            list="daftar-satuan"
            placeholder="Satuan (contoh: porsi, kg, pasang)"
            className="w-full border rounded-lg p-3"
            value={satuan}
            onChange={(e) => setSatuan(e.target.value)}
            required
          />
          <datalist id="daftar-satuan">
            {daftarSatuan.map((s) => (
              <option key={s} value={s} />
            ))}
          </datalist>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white p-3 rounded-lg font-medium disabled:opacity-50"
        >
          {loading ? "Menyimpan..." : "Simpan Transaksi"}
        </button>
      </form>
    </main>
  );
}