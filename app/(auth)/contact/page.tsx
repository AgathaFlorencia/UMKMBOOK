// ============================================================
// HALAMAN: CONTACT (/contact)
// ============================================================
// Halaman publik, bisa diakses tanpa login. Ganti kontak di
// bawah dengan info kontak yang sesuai (email, WhatsApp, dll).

export default function ContactPage() {
  return (
    <main className="min-h-screen p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Hubungi Kami</h1>
      <p className="text-gray-600 leading-relaxed mb-4">
        Ada pertanyaan, masukan, atau kendala saat menggunakan
        UMKMBook? Silakan hubungi kami lewat kontak di bawah ini.
      </p>
      <div className="space-y-2 text-sm">
        <p>
          <span className="text-gray-500">Email:</span> ganti-dengan-email@contoh.com
        </p>
        <p>
          <span className="text-gray-500">WhatsApp:</span> ganti-dengan-nomor
        </p>
      </div>
    </main>
  );
}