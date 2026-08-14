// ============================================================
// LAYOUT UTAMA — "bungkus" semua halaman
// ============================================================
// File ini otomatis membungkus SEMUA halaman di app/. Komponen
// yang mau tampil terus-menerus di semua halaman (contoh: Navbar)
// dipasang di sini, gak perlu ditulis ulang di tiap halaman.

import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata: Metadata = {
  title: "UMKMBook",
  description: "Pencatatan keuangan super simpel untuk usaha mikro",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
