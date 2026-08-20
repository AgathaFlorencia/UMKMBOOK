import { Poppins } from "next/font/google";
import {
  PlayCircle,
  PencilLine,
  LineChart,
  Receipt,
  CalendarDays,
  HandCoins,
  Rocket,
  ArrowRight,
} from "lucide-react";

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

const steps = [
  {
    title: "Mulai",
    description:
      "Daftar usahamu dalam hitungan detik — cukup isi nama & jenis usaha, langsung siap pakai.",
    icon: PlayCircle,
  },
  {
    title: "Catat",
    description:
      "Tinggal tap buat catat transaksi. Nama & harga produk otomatis kesimpen buat dipakai lagi.",
    icon: PencilLine,
  },
  {
    title: "Analisa",
    description:
      "Lihat untung-rugi, produk terlaris, dan siapa yang masih ngutang dalam bahasa yang gampang dimengerti.",
    icon: LineChart,
  },
];

const features = [
  {
    title: "Catat Transaksi Kilat",
    description:
      "Tinggal tap, gak perlu setup ribet. Cocok buat dipakai sambil sibuk layani pembeli.",
    icon: Receipt,
  },
  {
    title: "Laporan Bulanan",
    description:
      "Laporan Bulanan yang mudah dimengerti — untung naik/turun, produk paling laku.",
    icon: CalendarDays,
  },
  {
    title: "Kasbon",
    description: "Catat siapa yang masih ngutang, biar gak lupa nagih.",
    icon: HandCoins,
  },
];

export default function AboutPage() {
  return (
    <main
      className={`${poppins.variable} relative w-full min-h-screen overflow-hidden bg-[linear-gradient(234deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)]`}
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      {/* Background pattern, sama seperti landing page */}
      <img
        className="absolute inset-0 h-full w-full object-cover"
        alt=""
        aria-hidden="true"
        src="/landing/background.png"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* ============ HEADER (sama seperti landing page) ============ */}
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
      const isActive = item.href === "/about";
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

        {/* ============ KONTEN ABOUT ============ */}
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-16 sm:px-10 lg:px-[100px] lg:py-24">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-12">
            {/* Kiri: About + Visi */}
            <div>
              <h1 className="text-4xl font-bold leading-tight text-black sm:text-5xl lg:text-6xl">
                About Us
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-black/80">
                UMKMBook adalah aplikasi pencatatan keuangan sederhana untuk
                pemilik usaha mikro seperti warung, laundry, dan reseller
                kecil yang selama ini masih mengandalkan buku tulis atau
                ingatan untuk mencatat keuangan usahanya.
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed text-black/80">
                Berbeda dari aplikasi kasir yang rumit, UMKMBook dirancang
                untuk usaha yang belum butuh sistem transaksi kompleks, tapi
                sudah mulai sadar pentingnya mencatat keuangan dengan rapi.
              </p>

              <div className="mt-14 flex items-start gap-4">
                <div className="flex h-[70px] w-[70px] shrink-0 items-center justify-center rounded-[10px] bg-[#e1eeff] shadow-[3px_4px_7px_rgba(255,255,255,0.25)]">
                  <Rocket className="h-7 w-7 text-[#1f68ba]" strokeWidth={2} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black sm:text-3xl">
                    Visi Kami
                  </h2>
                  <p className="mt-1 max-w-xs text-sm font-normal text-black/80">
                    Membangun langkah awal menuju UMKM yang cerdas finansial.
                  </p>
                </div>
              </div>
            </div>

            {/* Kanan: Steps + Features */}
            <div>
              {/* Steps: stack di mobile, 1 baris rapi di desktop (fix layout) */}
              <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                {steps.map((step, i) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title} className="sm:contents">
                      <div className="flex flex-col items-center text-center sm:w-[150px] lg:w-[170px]">
                        <div className="flex h-[60px] w-[60px] items-center justify-center rounded-[10px] bg-[#e1eeff] shadow-[3px_4px_7px_rgba(255,255,255,0.25)]">
                          <Icon
                            className="h-7 w-7 text-[#1f68ba]"
                            strokeWidth={2}
                          />
                        </div>
                        <h3 className="mt-3 text-base font-bold text-black">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-[13px] font-normal leading-snug text-black/80">
                          {step.description}
                        </p>
                      </div>
                      {i < steps.length - 1 && (
                        <ArrowRight className="mt-6 hidden h-5 w-5 shrink-0 self-start text-black/70 sm:block" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fitur */}
              <h2 className="mt-16 text-2xl font-bold text-black">
                Fitur Utama untuk Kemudahan Anda
              </h2>
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={feature.title}
                      className="rounded-[20px] bg-white p-5 text-center shadow-[4px_5px_10px_rgba(0,0,0,0.25)]"
                    >
                      <div className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-[10px] bg-[#e1eeff] shadow-[3px_4px_7px_rgba(0,0,0,0.25)]">
                        <Icon
                          className="h-7 w-7 text-[#1f68ba]"
                          strokeWidth={2}
                        />
                      </div>
                      <h3 className="mt-4 text-base font-bold text-black">
                        {feature.title}
                      </h3>
                      <p className="mt-2 text-[15px] font-normal leading-snug text-black/80">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}