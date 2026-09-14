// ============================================================
// HALAMAN: RIWAYAT TRANSAKSI (/riwayat)
// ============================================================
// Log semua transaksi yang pernah dicatat, DIKELOMPOKKAN per
// tanggal (bukan list panjang tanpa pemisah) biar tetap rapi
// dan mudah dibaca meskipun transaksinya banyak.
//
// Data mentahnya dari lib/riwayat.ts (sudah terurut dari yang
// terbaru) — pengelompokan per tanggal dilakukan di sini, di
// halaman ini, sebagai urusan tampilan.
//
// Server component (async) — sama polanya dengan Dashboard.
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

import { getRiwayatTransaksi, type RiwayatItem } from "@/lib/riwayat";
import { formatRupiah } from "@/lib/format";

// Kelompokkan list transaksi (yang sudah terurut dari lib) jadi
// per tanggal, tanpa mengubah urutan aslinya.
function kelompokkanPerTanggal(
  riwayat: RiwayatItem[]
): { tanggal: string; items: RiwayatItem[] }[] {
  const kelompok: { tanggal: string; items: RiwayatItem[] }[] = [];

  for (const item of riwayat) {
    const grupTerakhir = kelompok[kelompok.length - 1];
    if (grupTerakhir && grupTerakhir.tanggal === item.tanggal) {
      grupTerakhir.items.push(item);
    } else {
      kelompok.push({ tanggal: item.tanggal, items: [item] });
    }
  }

  return kelompok;
}

function formatTanggalIndonesia(tanggal: string): string {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function RiwayatPage() {
  const riwayat = await getRiwayatTransaksi();
  const kelompok = kelompokkanPerTanggal(riwayat);

  return (
    <main className="min-h-screen w-full overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6">
      <h1 className="text-2xl font-bold mb-4 text-white">Riwayat Transaksi</h1>

      {riwayat.length === 0 ? (
        <p className="text-white/80">Belum ada transaksi tercatat.</p>
      ) : (
        <div className="space-y-6">
          {kelompok.map((grup) => (
            <div key={grup.tanggal}>
              {/* Header tanggal, sekaligus total transaksi hari itu */}
              <div className="flex items-baseline justify-between mb-2 sticky top-0 bg-white rounded-lg px-3 py-1.5 shadow-sm">
                <h2 className="text-sm font-semibold text-gray-700">
                  {formatTanggalIndonesia(grup.tanggal)}
                </h2>
                <span className="text-xs text-gray-400">
                  {grup.items.length} transaksi
                </span>
              </div>

              <div className="space-y-2 mt-2">
                {grup.items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg p-4 flex items-center justify-between bg-white"
                  >
                    <div>
                      <p className="font-medium text-black">
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
                        {formatRupiah(item.harga_saat_transaksi)}
                      </p>
                    </div>
                    <p className="font-semibold text-black">
                      {formatRupiah(item.total)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}