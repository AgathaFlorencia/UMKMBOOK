// ============================================================
// LAYOUT: GROUP (auth) — bungkus halaman SEBELUM login
// ============================================================
// Route group "(auth)" cuma dipakai buat pengelompokan folder,
// TIDAK muncul di URL. Navbar TIDAK dipasang di sini lagi —
// login & onboarding tanpa navbar, sedangkan about & contact
// masing-masing manggil LoginNavbar sendiri di page.tsx-nya.

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}