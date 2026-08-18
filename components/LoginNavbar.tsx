// ============================================================
// KOMPONEN: NAVBAR HALAMAN LOGIN (dipakai di halaman sebelum login)
// ============================================================
// Beda dengan components/Navbar.tsx (navbar utama setelah login).
// Ini navbar buat halaman publik: Login, Onboarding, About, Contact.
// Sengaja gak ada menu Dashboard/Transaksi/dll di sini karena
// halaman-halaman itu cuma relevan buat user yang sudah login.

import Link from "next/link";

export default function LoginNavbar() {
  return (
    <nav className="border-b p-4 flex items-center justify-between">
      <Link href="/login" className="font-bold text-lg">
        UMKMBook
      </Link>

      <div className="flex gap-4 text-sm">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <Link href="/about" className="hover:underline">
          About
        </Link>
        <Link href="/contact" className="hover:underline">
          Contact
        </Link>
      </div>
    </nav>
  );
}