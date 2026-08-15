// ============================================================
// HALAMAN: RIWAYAT TRANSAKSI (/riwayat)
// ============================================================
// Log semua transaksi yang pernah dicatat, diurutkan dari yang
// terbaru. Data diambil lewat lib/riwayat.ts, otomatis cuma
// nampilin transaksi milik user yang login (dijaga oleh RLS di
// sisi database, bukan di kode ini).
//
// Server component (async, tanpa "use client") — sama polanya
// dengan Dashboard.
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

import { getRiwayatTransaksi } from "@/lib/riwayat";
import { formatRupiah } from "@/lib/format";

export default async function RiwayatPage() {
  const riwayat = await getRiwayatTransaksi();

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>

      {riwayat.length === 0 ? (
        <p className="text-gray-500">Belum ada transaksi tercatat.</p>
      ) : (
        <div className="space-y-2">
          {riwayat.map((item) => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">
                  {item.nama_produk}{" "}
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ml-1 ${
                      item.jenis === "jual"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.jenis === "jual" ? "Jual" : "Beli"}
                  </span>
                </p>
                <p className="text-sm text-gray-500">
                  {item.jumlah} {item.satuan} x{" "}
                  {formatRupiah(item.harga_saat_transaksi)} —{" "}
                  {new Date(item.tanggal).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <p className="font-semibold">{formatRupiah(item.total)}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}