// ============================================================
// HALAMAN: DASHBOARD (/)
// ============================================================
// Ini halaman pertama yang dilihat user setelah login.
// Isinya: ringkasan hari ini (masuk/keluar/untung) + tombol
// besar "Catat Transaksi".
//
// File ini berada di app/page.tsx, artinya ini halaman untuk
// route "/" (halaman utama website).

export default function DashboardPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      {/* Nanti bagian ini diisi data asli dari Supabase:
          total masuk, total keluar, untung hari ini */}
      <section className="grid grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Masuk hari ini</p>
          <p className="text-xl font-semibold">Rp0</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Keluar hari ini</p>
          <p className="text-xl font-semibold">Rp0</p>
        </div>
        <div className="border rounded-lg p-4">
          <p className="text-sm text-gray-500">Untung hari ini</p>
          <p className="text-xl font-semibold">Rp0</p>
        </div>
      </section>

      <a
        href="/transaksi"
        className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium"
      >
        + Catat Transaksi
      </a>
    </main>
  );
}
