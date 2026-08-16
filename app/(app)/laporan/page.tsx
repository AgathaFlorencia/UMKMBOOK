// ============================================================
// HALAMAN: LAPORAN / INSIGHT (/laporan)
// ============================================================
// Ringkasan BULANAN (bukan harian) dalam bahasa "manusiawi",
// contoh: "Bulan ini untung Rp450rb, naik 12% dari bulan lalu".
// Rentang sebulan ini yang bikin pembelian bahan pokok di awal
// bulan gak bikin laporan keliatan timpang (beda dengan Dashboard
// yang cuma nampilin arus kas HARIAN).
//
// Juga nampilin produk terlaris + margin per produk (khusus
// untuk reseller yang sudah isi modal per unit di halaman Produk).
//
// Server component (async) — sama polanya dengan Dashboard.
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

import { getRingkasanBulanan, getProdukTerlaris } from "@/lib/laporan";
import { formatRupiah } from "@/lib/format";

export default async function LaporanPage() {
  const [ringkasan, produkTerlaris] = await Promise.all([
    getRingkasanBulanan(),
    getProdukTerlaris(),
  ]);

  const namaBulanIni = new Date().toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan & Insight</h1>

      {/* Ringkasan bahasa manusiawi */}
      <section className="border rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-500 mb-1">{namaBulanIni}</p>
        <p className="text-lg">
          Bulan ini {ringkasan.untungBulanIni >= 0 ? "untung" : "rugi"}{" "}
          <span className="font-semibold">
            {formatRupiah(Math.abs(ringkasan.untungBulanIni))}
          </span>
          {ringkasan.persentasePerubahan !== null && (
            <>
              {", "}
              {ringkasan.persentasePerubahan >= 0 ? "naik" : "turun"}{" "}
              <span className="font-semibold">
                {Math.abs(ringkasan.persentasePerubahan).toFixed(0)}%
              </span>{" "}
              dari bulan lalu
            </>
          )}
          .
        </p>

        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
          <div>
            <p className="text-gray-500">Total masuk</p>
            <p className="font-medium">
              {formatRupiah(ringkasan.totalMasuk)}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Total keluar</p>
            <p className="font-medium">
              {formatRupiah(ringkasan.totalKeluar)}
            </p>
          </div>
        </div>
      </section>

      {/* Produk terlaris */}
      <section>
        <h2 className="font-semibold mb-3">
          Produk/Layanan Terlaris Bulan Ini
        </h2>

        {produkTerlaris.length === 0 ? (
          <p className="text-gray-500 text-sm">
            Belum cukup data bulan ini untuk membuat laporan.
          </p>
        ) : (
          <div className="space-y-2">
            {produkTerlaris.map((p) => (
              <div
                key={p.namaProduk}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{p.namaProduk}</p>
                  <p className="text-sm text-gray-500">
                    Terjual {p.jumlahTerjual} {p.satuan} — Omzet{" "}
                    {formatRupiah(p.omzet)}
                  </p>
                </div>
                <div className="text-right">
                  {p.margin !== null ? (
                    <p className="text-sm">
                      <span className="text-gray-500">Margin: </span>
                      <span className="font-medium">
                        {formatRupiah(p.margin)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">
                      Margin belum diketahui
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-400 mt-3">
          Tips: isi &quot;Modal per unit&quot; di halaman Produk supaya
          margin per produk bisa dihitung (khusus reseller). Produk
          terlaris belum tentu paling untung — cek marginnya juga.
        </p>
      </section>
    </main>
  );
}