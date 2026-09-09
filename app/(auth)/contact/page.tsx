"use client";

import { Poppins } from "next/font/google";
import { Mail } from "lucide-react";

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

export default function ContactPage() {
  return (
    <main
      className={`${poppins.variable} relative w-full min-h-screen overflow-hidden bg-[linear-gradient(234deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)]`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Background pattern, sama seperti landing & about page */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        alt=""
        aria-hidden="true"
        src="/landing/background.png"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ============ HEADER (sama persis seperti about page) ============ */}
        <header className="flex flex-col gap-4 px-6 pt-8 sm:flex-row sm:items-center sm:justify-between sm:px-10 lg:px-[100px] lg:pt-[71px]">
          <a href="/" aria-label="UMKM Book, kembali ke halaman utama">
            <img
              className="h-auto w-[130px] sm:w-[150px] lg:w-[162px]"
              alt="Logo UMKM Book"
              src="/landing/logo.png"
            />
          </a>
          <nav
            aria-label="Navigasi utama"
            className="flex items-center gap-6 sm:gap-10 lg:gap-[66px]"
          >
            {navigationItems.map((item) => {
              const isActive = item.href === "/contact";
              return (
                <a
                  key={item.label}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="font-medium text-black text-base leading-normal sm:text-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c] aria-[current=page]:underline aria-[current=page]:underline-offset-4"
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
        </header>

        {/* ============ KONTEN CONTACT ============ */}
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-16 sm:px-10 lg:px-[100px] lg:py-24">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_1.4fr]">
            {/* Kiri: Judul + Deskripsi + Card kontak */}
            <div>
              <h1 className="text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
                Contact Us
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black/80 sm:text-lg lg:text-2xl">
                Ada pertanyaan, masukan, atau kendala saat menggunakan
                UMKMBook? Silakan hubungi kami lewat kontak dibawah ini.
              </p>

              <a
                href="mailto:meyolen@gmail.com"
                aria-label="Email meyolen@gmail.com"
                className="mt-10 flex w-full max-w-[423px] items-center gap-5 rounded-[20px] bg-white p-6 shadow-[4px_5px_10px_rgba(0,0,0,0.25)] transition-transform hover:scale-[1.02]"
              >
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[14px] bg-[#e1eeff]">
                  <Mail className="h-8 w-8 text-[#1f68ba]" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black sm:text-[28px]">
                    Email
                  </h2>
                  <p className="mt-1 text-lg font-light text-black/90">
                    meyolen@gmail.com
                  </p>
                </div>
              </a>
            </div>

            {/* Kanan: Illustration */}
            <div className="relative flex justify-center lg:justify-end lg:-mr-16">
              <img
                className="w-full max-w-[700px] object-contain"
                alt="Contact illustration"
                src="/contact/illustration.png"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}