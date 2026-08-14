// ============================================================
// HALAMAN: RIWAYAT TRANSAKSI (/riwayat)
// ============================================================
// Log semua transaksi yang pernah dicatat, biasanya diurutkan
// dari yang terbaru. Data diambil dari tabel "transaksi" di
// Supabase, difilter otomatis berdasarkan user yang login
// (Supabase Row Level Security yang mengatur ini di sisi database).

export default function RiwayatPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Riwayat Transaksi</h1>
      {/* TODO: query tabel "transaksi" via lib/supabase-server.ts */}
      <p className="text-gray-500">Belum ada transaksi tercatat.</p>
    </main>
  );
}
