// app/(auth)/login/page.tsx
// ============================================================
// HALAMAN: LOGIN
// ============================================================
// Sesuai desain Figma. Ada 2 panel:
// - Kiri: info UMKM Book (khusus desktop, disembunyikan di mobile)
// - Kanan: form login
// Layout desktop mengikuti Figma pixel-perfect, tapi disusun
// pakai flex (bukan absolute) supaya tetap rapi kalau ada
// perubahan konten ke depannya.

"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!emailOrPhone.trim() || !password) {
      setStatusMessage("Silakan isi alamat email atau nomor HP dan kata sandi.");
      return;
    }

    // TODO: panggil fungsi login Supabase kamu di sini, misal:
    // const { error } = await supabase.auth.signInWithPassword({
    //   email: emailOrPhone,
    //   password,
    // });
    // if (error) setStatusMessage(error.message);
    // else router.push("/dashboard");
  };

  return (
    <main className="flex min-h-screen w-full bg-white">
     {/* ============ PANEL KIRI (info) ============ */}
<section
  className="relative hidden w-[55%] max-w-[794px] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(329deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] px-10 py-16 text-center lg:flex"
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
    style={{right: "-160px"}}
    alt=""
    src="/auth/awan.png"
  />
</div>

  {/* Konten teks - di atas, z-10 */}
  <div className="relative z-10 flex flex-col items-center gap-14">
    <h1 className="max-w-[440px] font-['Poppins-Bold',Helvetica] text-4xl font-bold text-white lg:text-[40px]">
      Selamat Datang
    </h1>

    <div className="flex flex-col items-center gap-12">
      <img
        className="h-auto w-[280px]"
        alt="Logo UMKM Book"
        src="/landing/logo.png"
      />
      <p className="max-w-[430px] font-['Poppins-Regular',Helvetica] text-[15px] leading-normal text-black">
        Kelola keuangan usaha tanpa ribet, pantau keuntungan secara
        real-time kapan saja.
      </p>
    </div>
  </div>
</section>

      {/* ============ PANEL KANAN (form) ============ */}
      <section
        className="flex w-full flex-1 items-center justify-center bg-white px-6 py-16"
        aria-label="Formulir masuk"
      >
        <div className="w-full max-w-[440px] rounded-[25px] p-6 shadow-[6px_6px_8px_#00000040] sm:p-[25px]">
          <form
            className="flex w-full flex-col items-center gap-10"
            onSubmit={handleSubmit}
            noValidate
          >
            <h2 className="font-['Poppins-Bold',Helvetica] text-3xl font-bold text-black sm:text-[40px]">
              Login
            </h2>

            {/* Email / No HP */}
            <div className="flex w-full flex-col gap-2">
              <label
                className="font-['Poppins-Regular',Helvetica] text-base text-black"
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
                className="font-['Poppins-Regular',Helvetica] text-base text-black"
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
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  type="button"
                  aria-label={
                    isPasswordVisible ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
                  }
                  onClick={() => setIsPasswordVisible((visible) => !visible)}
                >
                  {isPasswordVisible ? (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M9.9 4.24A11 11 0 0 1 12 4c7 0 11 8 11 8a17.9 17.9 0 0 1-3.6 4.7M6.1 6.1C3.6 7.8 2 10.5 2 12s4 8 10 8a10.4 10.4 0 0 0 4.24-.9" />
                    </svg>
                  )}
                </button>
              </div>
              <Link
                className="self-end font-['Poppins-Regular',Helvetica] text-sm text-[#003fc9] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003fc9]"
                href="/lupa-password"
              >
                Lupa Kata Sandi?
              </Link>
            </div>

            {/* Tombol submit */}
            <button
              className="flex h-[60px] w-full items-center justify-center gap-2.5 rounded-3xl bg-[#0b192c] p-2.5 text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#003fc9]"
              type="submit"
            >
              <span className="font-['Poppins-Regular',Helvetica] text-lg font-normal sm:text-xl">
                MASUK SEKARANG
              </span>
            </button>

            {/* Link daftar */}
            <p className="font-['Poppins-Regular',Helvetica] text-base text-black">
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