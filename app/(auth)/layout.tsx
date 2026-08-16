// ============================================================
// LAYOUT: GROUP (auth) — bungkus halaman SEBELUM login
// ============================================================
// Route group "(auth)" cuma dipakai buat pengelompokan folder,
// TIDAK muncul di URL (folder "(auth)/login" tetap jadi "/login",
// bukan "/auth/login"). Semua halaman di dalam grup ini pakai
// LoginNavbar, BEDA dengan grup "(app)" yang pakai Navbar utama.

import LoginNavbar from "@/components/LoginNavbar";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoginNavbar />
      {children}
    </>
  );
}