// ============================================================
// LAYOUT: GROUP (app) — bungkus halaman SETELAH login
// ============================================================
// Semua halaman di dalam grup ini (Dashboard, Transaksi, Produk,
// Riwayat, Kasbon, Laporan, Pengaturan) pakai Navbar utama yang
// sudah ada sebelumnya.

import Navbar from "@/components/Navbar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}