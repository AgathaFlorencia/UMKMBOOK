// ============================================================
// HALAMAN: LANDING PAGE (/)
// ============================================================
// Halaman publik pertama yang dilihat semua orang, baik yang
// sudah login maupun belum (diatur di middleware.ts, "/" ada
// di ALWAYS_PUBLIC_ROUTES).
//
// Dari sini user pilih:
// - "Masuk"  -> /login
// - "Daftar" -> /onboarding
//
// Font Poppins di-scope KHUSUS di halaman ini (tidak menyentuh
// root layout/globals.css) supaya halaman lain tidak terpengaruh.
//
// Desain mengikuti Figma (desktop). Untuk tablet/mobile disusun
// ulang jadi layout flex yang menyusut proporsional, karena
// Figma yang tersedia hanya versi desktop.

import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

const navigationItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

// Posisi & ukuran ilustrasi di bawah ini dalam PERSEN, dihitung
// proporsional dari ukuran asli di Figma (container 593x654px),
// supaya ilustrasi tetap presisi relatif satu sama lain di
// segala ukuran layar (scale bareng, bukan pecah).
const floatingIllustrations = [
  {
    src: "/landing/notebook.png",
    alt: "Notebook ilustrasi",
    style: { top: "45.72%", left: "76.4%", width: "23.6%", height: "22%" },
  },
  {
    src: "/landing/dollar.png",
    alt: "Koin dolar ilustrasi",
    style: { top: "76.15%", left: "0%", width: "23.6%", height: "23.85%" },
  },
  {
    src: "/landing/lock.png",
    alt: "Gembok ilustrasi",
    style: { top: "0%", left: "65.9%", width: "23.6%", height: "26.3%" },
  },
  {
    src: "/landing/chart.png",
    alt: "Grafik ilustrasi",
    style: { top: "18%", left: "8.26%", width: "23.6%", height: "22%" },
  },
];

export default function LandingPage() {
  return (
    <main
      className={`${poppins.variable} relative w-full min-h-screen overflow-hidden bg-[linear-gradient(234deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)]`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Background pattern dari Figma */}
      <img
        className="absolute inset-0 w-full h-full object-cover"
        alt=""
        aria-hidden="true"
        src="/landing/background.png"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* ============ HEADER ============ */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-6 sm:px-10 lg:px-[100px] pt-8 lg:pt-[71px]">
          <a href="/" aria-label="UMKM Book, kembali ke halaman utama">
            <img
              className="w-[130px] sm:w-[150px] lg:w-[162px] h-auto"
              alt="Logo UMKM Book"
              src="/landing/logo.png"
            />
          </a>
          <nav
            aria-label="Navigasi utama"
            className="flex items-center gap-6 sm:gap-10 lg:gap-[66px]"
          >
            
            {navigationItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="font-medium text-black text-base sm:text-lg leading-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c]"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        {/* ============ HERO + ILUSTRASI ============ */}
        <div className="flex-1 flex flex-col lg:flex-row items-center lg:items-center justify-center lg:justify-between gap-14 lg:gap-8 px-6 sm:px-10 lg:px-[100px] max-w-[1440px] w-full mx-auto py-16 lg:py-0">
          {/* Teks & CTA */}
          <section
            className="w-full max-w-[446px] text-center lg:text-left"
            aria-labelledby="hero-heading"
          >
            <h1
              id="hero-heading"
              className="font-bold text-black text-3xl sm:text-4xl lg:text-[40px] leading-tight lg:leading-normal"
            >
              Kelola Keuangan Usaha Tanpa Ribet, Fokus Kembangkan Bisnis
            </h1>
            <p className="mt-6 font-normal text-black text-base leading-normal">
              Tinggalkan catatan manual. Catat transaksi dan pantau
              keuntungan usaha Anda secara real-time kapan saja.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 sm:gap-10">
              <a
                href="/onboarding"
                className="flex w-[160px] sm:w-[185px] h-[56px] sm:h-[60px] items-center justify-center gap-2.5 p-2.5 rounded-[10px] border border-solid border-[#1e1e1e] font-semibold text-[#1e1e1e] text-lg sm:text-xl leading-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c]"
              >
                Daftar
              </a>
              <a
                href="/login"
                className="flex w-[160px] sm:w-[185px] h-[56px] sm:h-[60px] items-center justify-center gap-2.5 p-2.5 bg-[#0b192c] rounded-[10px] font-normal text-[#ffb800] text-lg sm:text-xl leading-normal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c]"
              >
                Masuk
              </a>
            </div>
          </section>

          {/* Ilustrasi */}
          <section
            className="relative w-full max-w-[320px] sm:max-w-[440px] lg:max-w-[593px] aspect-[593/654]"
            aria-label="Ilustrasi fitur UMKM Book"
          >
            <img
              className="absolute object-cover"
              style={{ top: "21.87%", left: "0%", width: "91.4%", height: "73.5%" }}
              alt="Kursi sebagai ilustrasi ruang kerja usaha"
              src="/landing/chair.png"
            />
            {floatingIllustrations.map((illustration) => (
              <img
                key={illustration.alt}
                className="absolute object-cover"
                style={illustration.style}
                alt={illustration.alt}
                src={illustration.src}
              />
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}