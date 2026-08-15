// ============================================================
// HALAMAN: LAPORAN / INSIGHT (/laporan)
// ============================================================
// Ringkasan mingguan/bulanan dalam bahasa "manusiawi", contoh:
// "Minggu ini untung Rp450rb, naik 12%". Juga nampilin produk
// terlaris (dan margin-nya khusus untuk reseller).
//
// Proteksi login untuk halaman ini diatur terpusat di
// middleware.ts.

export default function LaporanPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Laporan & Insight</h1>
      {/* TODO: agregasi data dari tabel "transaksi", diolah jadi
          ringkasan bahasa natural di sini */}
      <p className="text-gray-500">Belum cukup data untuk membuat laporan.</p>
    </main>
  );
}
