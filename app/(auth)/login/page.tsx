// app/(auth)/login/page.tsx
"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-client";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailOrPhone.trim() || !password) {
      setStatusMessage("Silakan isi alamat email atau nomor HP dan kata sandi.");
      return;
    }

    setIsSubmitting(true);
    setStatusMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email: emailOrPhone,
      password,
    });

    setIsSubmitting(false);

    if (error) {
      setStatusMessage("Email/No. HP atau kata sandi salah.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    // RESPONSIVE: min-h-dvh lebih aman di mobile browser (address bar) daripada min-h-screen
    <main className="flex min-h-dvh min-h-screen w-full bg-white">
      {/* ============ PANEL KIRI (info) ============ */}
      <section
        className="relative hidden w-[55%] max-w-[794px] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(329deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] px-6 py-12 text-center lg:flex lg:px-10 lg:py-16"
        aria-label="Informasi UMKM Book"
      >
        {/* Background images - absolute, di belakang */}
        <div className="absolute inset-0">
          <Image
            className="object-cover"
            alt=""
            src="/landing/background.png"
            fill
            priority
          />
          <img
            className="absolute right-0 top-0 h-full w-auto object-cover"
            style={{ right: "-170px" }}
            alt=""
            src="/auth/awan.png"
          />
        </div>

        {/* Konten teks - di atas, z-10 */}
        {/* RESPONSIVE: gap dikecilin dulu di breakpoint bawah (xl belum tentu selalu lebar) */}
        <div className="relative z-10 flex flex-col items-center gap-10 xl:gap-14">
          <h1 className="max-w-[440px] font-['Poppins-Bold',Helvetica] text-3xl font-bold text-white xl:text-4xl xl:text-[40px]">
            Selamat Datang
          </h1>

          <div className="flex flex-col items-center gap-8 xl:gap-12">
            <img
              className="h-auto w-[220px] xl:w-[280px]"
              alt="Logo UMKM Book"
              src="/landing/logo.png"
            />
            <p className="max-w-[430px] font-['Poppins-Regular',Helvetica] text-sm leading-normal text-black xl:text-[15px]">
              Kelola keuangan usaha tanpa ribet, pantau keuntungan secara
              real-time kapan saja.
            </p>
          </div>
        </div>
      </section>

      {/* ============ PANEL KANAN (form) ============ */}
      {/* RESPONSIVE: padding vertikal & horizontal berjenjang, bukan angka tetap */}
      <section
        className="flex w-full flex-1 items-center justify-center bg-white px-4 py-10 sm:px-6 sm:py-14 lg:py-16"
        aria-label="Formulir masuk"
      >
        {/* RESPONSIVE: w-full biar penuh di HP kecil, baru dibatasi max-w di sm ke atas */}
        <div className="w-full max-w-[440px] rounded-[20px] p-5 shadow-[6px_6px_8px_#00000040] sm:rounded-[25px] sm:p-[25px]">
          <form
            className="flex w-full flex-col items-center gap-6 sm:gap-8 lg:gap-10"
            onSubmit={handleSubmit}
            noValidate
          >
            {/* RESPONSIVE: 3 step ukuran teks biar transisinya halus */}
            <h2 className="font-['Poppins-Bold',Helvetica] text-2xl font-bold text-black sm:text-3xl lg:text-[40px]">
              Login
            </h2>

            {/* Email / No HP */}
            <div className="flex w-full flex-col gap-2">
              <label
                className="font-['Poppins-Regular',Helvetica] text-sm text-black sm:text-base"
                htmlFor="email-or-phone"
              >
                Alamat Email atau No. HP
              </label>
              <input
                id="email-or-phone"
                className="h-[47px] w-full rounded-[10px] bg-[#f7f7f7] px-4 font-['Poppins-Regular',Helvetica] text-base text-black shadow-[4px_4px_4px_#00000040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c]"
                type="text"
                name="emailOrPhone"
                value={emailOrPhone}
                onChange={(event) => setEmailOrPhone(event.target.value)}
                autoComplete="username"
                aria-describedby="login-status"
                required
              />
            </div>

            {/* Kata Sandi */}
            <div className="flex w-full flex-col gap-2">
              <label
                className="font-['Poppins-Regular',Helvetica] text-sm text-black sm:text-base"
                htmlFor="password"
              >
                Kata Sandi
              </label>
              <div className="relative">
                <input
                  id="password"
                  className="h-[55px] w-full rounded-[10px] bg-[#f7f7f7] py-3 pl-4 pr-12 font-['Poppins-Regular',Helvetica] text-base text-black shadow-[4px_4px_4px_#00000040] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0b192c]"
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                  aria-describedby="login-status"
                  required
                />
                {/* RESPONSIVE: padding ditambah biar tap target lebih besar di HP (min ~44x44px) */}
                <button
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full p-2"
                  type="button"
                  aria-label={
                    isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                >
                  {isPasswordVisible ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A11 11 0 0 1 12 4c7 0 11 8 11 8a17.9 17.9 0 0 1-3.6 4.7M6.1 6.1C3.6 7.8 2 10.5 2 12s4 8 10 8a10.4 10.4 0 0 0 4.24-.9" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Tombol submit */}
            {/* RESPONSIVE: tinggi & ukuran teks bertingkat */}
            <button
              className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-3xl bg-[#0b192c] p-2.5 text-white shadow-sm transition-transform duration-100 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003fc9] sm:h-[60px]"
              type="submit"
              disabled={isSubmitting}
            >
              <span className="font-['Poppins-Regular',Helvetica] text-base font-normal sm:text-lg lg:text-xl">
                {isSubmitting ? "MEMPROSES..." : "MASUK SEKARANG"}
              </span>
            </button>

            {/* Link daftar */}
            <p className="text-center font-['Poppins-Regular',Helvetica] text-sm text-black sm:text-base">
              Belum punya akun?{" "}
              <Link
                className="text-[#003fc9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003fc9]"
                href="/onboarding"
              >
                Daftar di sini
              </Link>
            </p>

            <p id="login-status" className="sr-only" role="status" aria-live="polite">
              {statusMessage}
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}