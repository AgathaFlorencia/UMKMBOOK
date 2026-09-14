// ============================================================
// HALAMAN: CATAT TRANSAKSI (/transaksi)
// ============================================================
// UI sudah disesuaikan sama desain Figma (card putih dengan
// header navy, input abu-abu, tombol "Simpan" navy+gold).
//
// Logic-nya tetap sama seperti versi sebelumnya:
// - Toggle Jual / Beli/Keluar
// - Autofill: nama produk pakai <datalist>, kalau nama yang
//   diketik cocok sama produk yang sudah ada, harga & satuan
//   otomatis keisi (tapi tetap bisa diubah manual).
// - Logic backend (cek/buat produk baru, simpan transaksi
//   dengan harga snapshot) ada di lib/transaksi.ts — halaman
//   ini cuma manggil fungsi catatTransaksi() dari sana.
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.

"use client";

import { useEffect, useRef, useState } from "react";
import { catatTransaksi, type JenisTransaksi } from "@/lib/transaksi";
import { getDaftarProduk, type Produk } from "@/lib/produk";

// Daftar satuan umum yang selalu muncul di dropdown, biar user
// baru (belum punya produk sama sekali) tetap ada opsi pilihan.
const SATUAN_UMUM = ["porsi", "kg", "gram", "pcs", "pasang", "liter", "box"];

// Berapa lama pesan "berhasil disimpan" tampil sebelum hilang sendiri.
const DURASI_PESAN_SUKSES_MS = 3000;

export default function TransaksiPage() {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([]);
  const [jenis, setJenis] = useState<JenisTransaksi>("jual");
  const [namaProduk, setNamaProduk] = useState("");
  const [harga, setHarga] = useState("");
  const [jumlah, setJumlah] = useState("");
  const [satuan, setSatuan] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sukses, setSukses] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Ambil daftar produk sekali waktu halaman dibuka
  useEffect(() => {
    getDaftarProduk().then(setDaftarProduk);
  }, []);

  // Bersihin timer pesan sukses kalau halaman ditinggalkan
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Daftar satuan untuk dropdown: gabungan dari satuan yang sudah
  // pernah dipakai + daftar satuan umum, tanpa duplikat.
  const daftarSatuan = Array.from(
    new Set([...daftarProduk.map((p) => p.satuan), ...SATUAN_UMUM])
  );

  // Waktu nama produk berubah, cek apakah namanya cocok dengan
  // produk yang sudah ada -> kalau cocok, autofill harga & satuan.
  function handleNamaProdukChange(value: string) {
    setNamaProduk(value);

    const produkCocok = daftarProduk.find(
      (p) => p.nama_produk.toLowerCase() === value.toLowerCase()
    );

    if (produkCocok) {
      setHarga(String(produkCocok.harga_terbaru));
      setSatuan(produkCocok.satuan);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSukses(false);
    setLoading(true);

    const hasil = await catatTransaksi({
      namaProduk,
      jenis,
      harga: parseFloat(harga),
      jumlah: parseFloat(jumlah),
      satuan,
    });

    setLoading(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Terjadi kesalahan, coba lagi.");
      return;
    }

    // Berhasil -> tetap di halaman ini, kosongin form biar siap
    // dipakai catat transaksi berikutnya, dan kasih tanda sukses.
    setNamaProduk("");
    setHarga("");
    setJumlah("");
    setSatuan("");
    setSukses(true);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setSukses(false), DURASI_PESAN_SUKSES_MS);
  }

  return (
    <main
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6"
      aria-label="Halaman Transaksi"
    >
      <form
        className="flex w-full max-w-[446px] flex-col items-center overflow-hidden rounded-2xl bg-white"
        onSubmit={handleSubmit}
        noValidate
      >
        <header className="flex w-full items-center justify-center bg-[#081937] px-6 py-5">
          <h1 className="[font-family:'Inter-SemiBold',Helvetica] text-[32px] font-semibold text-white sm:text-[40px]">
            Transaksi
          </h1>
        </header>

        <div className="flex w-full flex-col gap-5 px-6 pt-6">
          {/* Toggle Jual / Beli — nggak ada di mockup Figma, tapi
              tetap dibutuhkan biar transaksi tercatat dengan jenis
              yang benar, jadi ditambahkan mengikuti palet warna
              yang sama (navy + gold) */}
          <div
            className="flex w-full gap-1.5 rounded-lg bg-[#d6d6d6] p-1.5"
            role="radiogroup"
            aria-label="Jenis transaksi"
          >
            <button
              type="button"
              role="radio"
              aria-checked={jenis === "jual"}
              onClick={() => setJenis("jual")}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors [font-family:'Poppins-Regular',Helvetica] ${
                jenis === "jual" ? "bg-[#081937] text-[#ffb800]" : "text-[#848484]"
              }`}
            >
              Jual
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={jenis === "beli"}
              onClick={() => setJenis("beli")}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition-colors [font-family:'Poppins-Regular',Helvetica] ${
                jenis === "beli" ? "bg-[#081937] text-[#ffb800]" : "text-[#848484]"
              }`}
            >
              Beli / Keluar
            </button>
          </div>

          {/* Nama produk: dropdown dari produk yang sudah ada,
              TAPI tetap bisa diketik bebas kalau produk baru */}
          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Nama produk atau layanan</span>
            <input
              className="h-full w-full bg-transparent [font-family:'Poppins-Regular',Helvetica] text-base text-[#848484] outline-none placeholder:text-[#848484]"
              type="text"
              list="daftar-nama-produk"
              value={namaProduk}
              onChange={(e) => handleNamaProdukChange(e.target.value)}
              placeholder="Nama produk / layanan"
              autoComplete="off"
              required
            />
            <datalist id="daftar-nama-produk">
              {daftarProduk.map((p) => (
                <option key={p.id} value={p.nama_produk} />
              ))}
            </datalist>
          </label>

          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Harga per satuan</span>
            <input
              className="h-full w-full bg-transparent [font-family:'Inter-Regular',Helvetica] text-base text-[#848484] outline-none placeholder:text-[#848484]"
              type="number"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              placeholder="Harga per satuan (contoh : Rp 5.000)"
              inputMode="numeric"
              min="0"
              required
            />
          </label>

          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Jumlah</span>
            <input
              className="h-full w-full bg-transparent [font-family:'Poppins-Regular',Helvetica] text-base text-[#848484] outline-none placeholder:text-[#848484]"
              type="number"
              value={jumlah}
              onChange={(e) => setJumlah(e.target.value)}
              placeholder="Jumlah (contoh : 2)"
              min="0"
              required
            />
          </label>

          {/* Satuan: sama, dropdown tapi tetap bisa ketik bebas */}
          <label className="flex h-[57px] w-full items-center gap-2.5 rounded-lg bg-[#d6d6d6] p-2.5">
            <span className="sr-only">Satuan</span>
            <input
              className="h-full w-full bg-transparent [font-family:'Poppins-Regular',Helvetica] text-base text-[#848484] outline-none placeholder:text-[#848484]"
              type="text"
              list="daftar-satuan"
              value={satuan}
              onChange={(e) => setSatuan(e.target.value)}
              placeholder="Satuan (contoh : porsi, kg , pasang)"
              autoComplete="off"
              required
            />
            <datalist id="daftar-satuan">
              {daftarSatuan.map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </label>
        </div>

        {error && (
          <p className="mt-4 px-6 text-sm text-red-500" role="alert">
            {error}
          </p>
        )}

        {sukses && (
          <p
            className="mt-4 flex items-center gap-2 rounded-lg bg-[#e7f6ec] px-4 py-2 text-sm font-semibold text-[#1f8a44]"
            role="status"
          >
            Transaksi berhasil disimpan
          </p>
        )}

        <button
          className="my-6 flex h-[47px] w-[149px] items-center justify-center rounded-[10px] bg-[#081937] disabled:opacity-50"
          type="submit"
          disabled={loading}
        >
          <span className="[font-family:'Poppins-SemiBold',Helvetica] text-xl font-semibold text-[#ffb800]">
            {loading ? "Menyimpan..." : "Simpan"}
          </span>
        </button>
      </form>
    </main>
  );
}
