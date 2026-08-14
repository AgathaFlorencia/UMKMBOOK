// ============================================================
// HALAMAN: KASBON (/kasbon)
// ============================================================
// Fitur OPSIONAL — pelacak utang pelanggan. Nampilin siapa
// masih ngutang berapa. Aktif kalau relevan (misal: user pernah
// input transaksi dengan status "belum lunas").

export default function KasbonPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Kasbon</h1>
      {/* TODO: query tabel "kasbon", tampilkan nama pelanggan + sisa utang */}
      <p className="text-gray-500">Belum ada catatan kasbon.</p>
    </main>
  );
}
