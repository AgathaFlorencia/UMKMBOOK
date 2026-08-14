// ============================================================
// HALAMAN: DAFTAR PRODUK/LAYANAN (/produk)
// ============================================================
// Menampilkan list produk yang "kebentuk otomatis" dari
// kebiasaan input di halaman Catat Transaksi. Di sini juga
// tempat owner bisa EDIT harga (berlaku untuk transaksi baru
// saja, transaksi lama tidak berubah) dan isi modal per unit
// (khusus reseller, buat hitung margin).

export default function ProdukPage() {
  return (
    <main className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Daftar Produk/Layanan</h1>
      {/* TODO: ambil data dari tabel "produk" lewat
          lib/supabase-server.ts, tampilkan sebagai list/tabel */}
      <p className="text-gray-500">Belum ada produk. Produk otomatis muncul di sini setelah transaksi pertama.</p>
    </main>
  );
}
