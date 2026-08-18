// ============================================================
// KOMPONEN: NAVIGASI (dipakai bareng di semua halaman)
// ============================================================
// Ini contoh "komponen" — potongan UI yang dipakai berulang di
// banyak halaman, jadi gak perlu ditulis ulang tiap file.
// Bedanya sama folder app/: folder app/ isinya HALAMAN (punya
// URL sendiri-sendiri), folder components/ isinya "potongan UI"
// yang dipasang DI DALAM halaman-halaman itu.

import Link from "next/link";

const menu = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/transaksi", label: "Catat Transaksi" },
  { href: "/produk", label: "Produk" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/kasbon", label: "Kasbon" },
  { href: "/pengaturan", label: "Pengaturan" },
];

export default function Navbar() {
  return (
    <nav className="border-b p-4 flex gap-4 flex-wrap text-sm">
      {menu.map((item) => (
        <Link key={item.href} href={item.href} className="hover:underline">
          {item.label}
        </Link>
      ))}
    </nav>
  );
}