// ============================================================
// LAYOUT UTAMA — "bungkus" SEMUA halaman (auth maupun app)
// ============================================================
// Ini paling luar, cuma nyimpen <html>/<body> dan metadata.
// Navbar TIDAK dipasang di sini lagi — sekarang tiap route group
// punya navbar sendiri:
// - app/(auth)/layout.tsx -> pakai LoginNavbar (Login, Onboarding,
//   About, Contact)
// - app/(app)/layout.tsx  -> pakai Navbar utama (Dashboard,
//   Transaksi, dll — setelah login)

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UMKMBook",
  description: "Pencatatan keuangan super simpel untuk usaha mikro",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}