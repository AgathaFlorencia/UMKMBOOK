// ============================================================
// HALAMAN: ABOUT (/about)
// ============================================================
// Halaman publik, bisa diakses tanpa login. Isinya penjelasan
// singkat tentang UMKMBook. Ganti teksnya sesuai kebutuhan.

export default function AboutPage() {
  return (
    <main className="min-h-screen p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Tentang UMKMBook</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        UMKMBook adalah aplikasi pencatatan keuangan sederhana untuk
        pemilik usaha mikro — warung, laundry, dan reseller kecil —
        yang selama ini masih mengandalkan buku tulis atau ingatan
        untuk mencatat keuangan usahanya.
      </p>
      <p className="text-gray-600 leading-relaxed">
        Berbeda dari aplikasi kasir yang rumit, UMKMBook dirancang
        untuk usaha yang belum butuh sistem transaksi kompleks, tapi
        sudah mulai sadar pentingnya mencatat keuangan dengan rapi.
      </p>
    </main>
  );
}