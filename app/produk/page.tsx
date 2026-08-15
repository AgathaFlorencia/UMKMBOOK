// ============================================================
// HALAMAN: DAFTAR PRODUK/LAYANAN (/produk)
// ============================================================
// Menampilkan list produk yang "kebentuk otomatis" dari
// kebiasaan input di halaman Catat Transaksi. Di sini owner bisa
// EDIT harga (berlaku untuk transaksi BARU saja, transaksi lama
// tidak berubah) dan isi modal per unit (khusus reseller, buat
// hitung margin nanti).
//
// "use client" karena ada interaksi edit + simpan langsung di
// halaman ini (bukan cuma nampilin data doang seperti Riwayat).
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

"use client";

import { useEffect, useState } from "react";
import { getDaftarProduk, updateProduk, type Produk } from "@/lib/produk";
import { formatRupiah } from "@/lib/format";

export default function ProdukPage() {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDaftarProduk().then((data) => {
      setDaftarProduk(data);
      setLoading(false);
    });
  }, []);

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-1">Daftar Produk/Layanan</h1>
      <p className="text-sm text-gray-500 mb-6">
        Mengubah harga di sini hanya berlaku untuk transaksi baru ke
        depan. Transaksi yang sudah tercatat tidak akan berubah.
      </p>

      {loading && <p className="text-gray-500">Memuat...</p>}

      {!loading && daftarProduk.length === 0 && (
        <p className="text-gray-500">
          Belum ada produk. Produk otomatis muncul di sini setelah
          transaksi pertama.
        </p>
      )}

      <div className="space-y-3">
        {daftarProduk.map((produk) => (
          <ProdukRow key={produk.id} produk={produk} />
        ))}
      </div>
    </main>
  );
}

function ProdukRow({ produk }: { produk: Produk }) {
  const [harga, setHarga] = useState(String(produk.harga_terbaru));
  const [modal, setModal] = useState(
    produk.modal_per_unit != null ? String(produk.modal_per_unit) : ""
  );
  const [saving, setSaving] = useState(false);
  const [tersimpan, setTersimpan] = useState(false);
  const [error, setError] = useState("");

  async function handleSimpan() {
    setSaving(true);
    setError("");
    setTersimpan(false);

    const hasil = await updateProduk(produk.id, {
      hargaTerbaru: parseFloat(harga),
      modalPerUnit: modal === "" ? null : parseFloat(modal),
    });

    setSaving(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Gagal menyimpan.");
      return;
    }

    setTersimpan(true);
    setTimeout(() => setTersimpan(false), 2000);
  }

  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="font-medium">
          {produk.nama_produk}{" "}
          <span className="text-xs text-gray-400">/ {produk.satuan}</span>
        </p>
        <p className="text-xs text-gray-400">
          Harga saat ini: {formatRupiah(produk.harga_terbaru)}
        </p>
      </div>

      <div className="flex gap-2 items-end flex-wrap">
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Harga jual
          </label>
          <input
            type="number"
            className="border rounded-lg p-2 w-32"
            value={harga}
            onChange={(e) => setHarga(e.target.value)}
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">
            Modal per unit (opsional)
          </label>
          <input
            type="number"
            className="border rounded-lg p-2 w-32"
            placeholder="Khusus reseller"
            value={modal}
            onChange={(e) => setModal(e.target.value)}
            min="0"
          />
        </div>
        <button
          onClick={handleSimpan}
          disabled={saving}
          className="bg-black text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
        >
          {saving ? "Menyimpan..." : "Simpan"}
        </button>
        {tersimpan && (
          <span className="text-green-600 text-sm">Tersimpan ✓</span>
        )}
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}