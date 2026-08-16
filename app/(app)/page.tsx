// ============================================================
// HALAMAN: DASHBOARD (/)
// ============================================================
// Ini halaman pertama yang dilihat user setelah login.
// Isinya: ringkasan hari ini (masuk/keluar/untung) + tombol
// besar "Catat Transaksi".
//
// Ini "server component" (async, tanpa "use client") — datanya
// diambil LANGSUNG di server lewat lib/dashboard.ts, sebelum
// halaman dikirim ke browser. Makanya tidak perlu useEffect/loading
// state seperti di halaman yang "use client".
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

import { getRingkasanHariIni } from "@/lib/dashboard";
import { formatRupiah } from "@/lib/format";

export default async function DashboardPage() {
  const ringkasan = await getRingkasanHariIni();

  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Masuk hari ini</p>
          <p className="text-xl font-semibold">
            {formatRupiah(ringkasan.totalMasuk)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Keluar hari ini</p>
          <p className="text-xl font-semibold">
            {formatRupiah(ringkasan.totalKeluar)}
          </p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Untung hari ini</p>
          <p className="text-xl font-semibold">
            {formatRupiah(ringkasan.untung)}
          </p>
        </div>
      </section>

      <a href="/transaksi" className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium">+ Catat Transaksi</a>
    </main>
  );
}