"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  getRingkasanPeriode,
  getGrafikPenjualanHarian,
  getProdukTerlarisPeriode,
  getProdukTerlarisAllTime,
  type RingkasanPeriode,
  type TitikGrafikHarian,
  type ProdukTerlaris,
} from "@/lib/laporan";
import { getProfilToko } from "@/lib/profil";
import { formatRupiah } from "@/lib/format";

// ------------------------------------------------------------
// Helper tanggal & preset filter
// ------------------------------------------------------------

function keFormatTanggal(d: Date): string {
  return d.toISOString().split("T")[0];
}

function formatTanggalTampilan(iso: string): string {
  const [tahun, bulan, hari] = iso.split("-");
  return `${hari}/${bulan}/${tahun}`;
}

function formatRupiahRingkas(nilai: number): string {
  if (nilai >= 1_000_000) {
    return `${(nilai / 1_000_000).toFixed(nilai % 1_000_000 === 0 ? 0 : 1)}jt`;
  }
  if (nilai >= 1_000) return `${(nilai / 1_000).toFixed(0)}rb`;
  return `${nilai}`;
}

function generatePresetParuhBulan(jumlah: number) {
  const hasil: { dari: string; sampai: string }[] = [];
  const sekarang = new Date();
  let tahun = sekarang.getFullYear();
  let bulan = sekarang.getMonth();
  let paruhPertama = sekarang.getDate() <= 15;

  for (let i = 0; i < jumlah; i++) {
    if (paruhPertama) {
      hasil.push({
        dari: keFormatTanggal(new Date(tahun, bulan, 1)),
        sampai: keFormatTanggal(new Date(tahun, bulan, 15)),
      });
    } else {
      const akhirBulan = new Date(tahun, bulan + 1, 0).getDate();
      hasil.push({
        dari: keFormatTanggal(new Date(tahun, bulan, 16)),
        sampai: keFormatTanggal(new Date(tahun, bulan, akhirBulan)),
      });
    }

    paruhPertama = !paruhPertama;
    if (paruhPertama) {
      bulan -= 1;
      if (bulan < 0) {
        bulan = 11;
        tahun -= 1;
      }
    }
  }

  return hasil;
}

export default function DashboardPage() {
  const presetTanggal = useMemo(() => generatePresetParuhBulan(3), []);

  const [dari, setDari] = useState(presetTanggal[0].dari);
  const [sampai, setSampai] = useState(presetTanggal[0].sampai);

  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [modeTanggalKhusus, setModeTanggalKhusus] = useState(false);

  const [namaUsaha, setNamaUsaha] = useState<string | null>(null);

  const [ringkasanPeriode, setRingkasanPeriode] = useState<RingkasanPeriode | null>(null);
  const [grafik, setGrafik] = useState<TitikGrafikHarian[]>([]);
  const [produkTerlarisPeriode, setProdukTerlarisPeriode] = useState<ProdukTerlaris[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(true);

  const [produkTerlarisAllTime, setProdukTerlarisAllTime] = useState<ProdukTerlaris[]>([]);

  // Nama toko & produk terlaris all-time dimuat sekali saja saat halaman dibuka
  useEffect(() => {
    getProfilToko().then((profil) => setNamaUsaha(profil?.namaUsaha ?? null));
    getProdukTerlarisAllTime().then(setProdukTerlarisAllTime);
  }, []);

  // Data yang mengikuti filter tanggal, dimuat ulang setiap kali berubah
  useEffect(() => {
    if (!dari || !sampai) return;

    setLoadingPeriode(true);
    Promise.all([
      getRingkasanPeriode(dari, sampai),
      getGrafikPenjualanHarian(dari, sampai),
      getProdukTerlarisPeriode(dari, sampai),
    ]).then(([ringkasan, grafikData, terlaris]) => {
      setRingkasanPeriode(ringkasan);
      setGrafik(grafikData);
      setProdukTerlarisPeriode(terlaris);
      setLoadingPeriode(false);
    });
  }, [dari, sampai]);

  function pilihPreset(preset: { dari: string; sampai: string }) {
    setDari(preset.dari);
    setSampai(preset.sampai);
    setModeTanggalKhusus(false);
    setIsDateMenuOpen(false);
  }

  const maxJumlahTerjual = Math.max(1, ...produkTerlarisPeriode.map((p) => p.jumlahTerjual));
  const hanyaSatuTitik = grafik.length === 1;

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6 md:p-8"
      aria-label="Dashboard UMKM Book"
    >
      {/* Header sapaan */}
      <header className="flex flex-col justify-center gap-2 rounded-2xl bg-white px-6 py-6 md:px-10">
        <h1 className="text-3xl font-semibold text-[#5d9dff] md:text-4xl">
          Hi, {namaUsaha ?? "..."}
        </h1>
        <p className="text-[13px] text-black">
          Siap memulai hari mu dengan UMKM Book?
        </p>
      </header>

      {/* Judul Dashboard + filter tanggal */}
      <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-3xl font-semibold text-white md:text-[40px]">
            Dashboard
          </h2>
          <p className="text-lg text-white md:text-xl">
            Laporan kamu akan terlihat di sini
          </p>
        </div>

        <div className="relative">
          <button
            type="button"
            className="flex h-[61px] items-center gap-3.5 rounded-2xl bg-white px-3.5 py-2.5"
            aria-expanded={isDateMenuOpen}
            aria-haspopup="listbox"
            aria-label={`Pilih rentang tanggal, saat ini ${formatTanggalTampilan(dari)} - ${formatTanggalTampilan(sampai)}`}
            onClick={() => setIsDateMenuOpen((isOpen) => !isOpen)}
          >
            <Image src="/dashboard/calendar.png" alt="" width={27} height={27} aria-hidden="true" />
            <span className="whitespace-nowrap text-base text-black">
              {formatTanggalTampilan(dari)} - {formatTanggalTampilan(sampai)}
            </span>
            <Image
              src="/dashboard/chevron-down.png"
              alt=""
              width={15}
              height={15}
              aria-hidden="true"
              className={`transition-transform ${isDateMenuOpen ? "rotate-180" : ""}`}
            />
          </button>

          {isDateMenuOpen && (
            <div
              className="absolute right-0 top-[69px] z-10 w-[280px] overflow-hidden rounded-2xl bg-white py-2 shadow-[4px_4px_12px_#00000040]"
              role="listbox"
              aria-label="Pilihan rentang tanggal"
            >
              {presetTanggal.map((preset) => (
                <button
                  key={`${preset.dari}-${preset.sampai}`}
                  type="button"
                  role="option"
                  aria-selected={dari === preset.dari && sampai === preset.sampai}
                  className="w-full px-4 py-2 text-left text-sm text-black hover:bg-[#f1f6ff] focus:bg-[#f1f6ff] focus:outline-none"
                  onClick={() => pilihPreset(preset)}
                >
                  {formatTanggalTampilan(preset.dari)} - {formatTanggalTampilan(preset.sampai)}
                </button>
              ))}
              <button
                type="button"
                className="w-full border-t px-4 py-2 text-left text-sm text-black hover:bg-[#f1f6ff] focus:bg-[#f1f6ff] focus:outline-none"
                onClick={() => setModeTanggalKhusus((mode) => !mode)}
              >
                Pilih tanggal sendiri...
              </button>

              {modeTanggalKhusus && (
                <div className="flex flex-col gap-2 px-4 py-2">
                  <label className="text-xs text-gray-500">
                    Dari
                    <input
                      type="date"
                      value={dari}
                      onChange={(e) => setDari(e.target.value)}
                      className="mt-1 w-full rounded-lg border p-1.5 text-sm"
                    />
                  </label>
                  <label className="text-xs text-gray-500">
                    Sampai
                    <input
                      type="date"
                      value={sampai}
                      onChange={(e) => setSampai(e.target.value)}
                      className="mt-1 w-full rounded-lg border p-1.5 text-sm"
                    />
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Kartu ringkasan */}
      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3" aria-label="Ringkasan penjualan">
        <article className="relative h-[179px] overflow-hidden rounded-[30px] bg-[linear-gradient(270deg,rgba(197,207,255,1)_27%,rgba(137,143,175,1)_100%)] p-6 shadow-[4px_4px_4px_#00000040]">
          <h3 className="text-lg font-medium text-white">Total Penjualan</h3>
          <div className="mt-6 flex items-baseline gap-1 text-white">
            <span className="text-base">Rp</span>
            <span className="text-[32px] font-semibold">
              {loadingPeriode || !ringkasanPeriode
                ? "..."
                : ringkasanPeriode.totalMasuk.toLocaleString("id-ID")}
            </span>
          </div>
          <Image
            src="/dashboard/fund-accounting.png"
            alt=""
            width={106}
            height={99}
            aria-hidden="true"
            className="absolute bottom-4 right-6"
          />
        </article>

        <article className="relative h-[179px] overflow-hidden rounded-[30px] bg-[linear-gradient(270deg,rgba(116,203,235,1)_0%,rgba(74,130,151,1)_100%)] p-6 shadow-[4px_4px_4px_#00000040]">
          <h3 className="text-lg font-medium text-white">Jumlah Transaksi</h3>
          <div className="mt-6 text-4xl font-semibold text-white">
            {loadingPeriode || !ringkasanPeriode ? "..." : ringkasanPeriode.jumlahTransaksi}
          </div>
          <Image
            src="/dashboard/purchase-order.png"
            alt=""
            width={121}
            height={112}
            aria-hidden="true"
            className="absolute bottom-4 right-6"
          />
        </article>

        <article className="relative h-[179px] overflow-hidden rounded-[30px] bg-[linear-gradient(270deg,rgba(195,222,221,1)_0%,rgba(124,161,159,1)_100%)] p-6 shadow-[4px_4px_4px_#00000040]">
          <h3 className="text-lg font-medium text-white">Total Produk Terjual</h3>
          <div className="mt-6 text-4xl font-semibold text-white">
            {loadingPeriode || !ringkasanPeriode ? "..." : ringkasanPeriode.totalProdukTerjual}
          </div>
          <Image
            src="/dashboard/product.png"
            alt=""
            width={115}
            height={113}
            aria-hidden="true"
            className="absolute bottom-4 right-6"
          />
        </article>
      </section>

      {/* Grafik & produk terlaris (periode terpilih) */}
      <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_352px]" aria-label="Laporan penjualan">
        <article className="rounded-[30px] bg-white p-6 shadow-lg">
          <h3 className="text-base text-black">Total Penjualan</h3>
          <div className="mt-6" style={{ height: 300 }}>
            {grafik.length === 0 ? (
              <p className="text-sm text-gray-500">
                {loadingPeriode ? "Memuat..." : "Belum ada penjualan di periode ini."}
              </p>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={grafik} margin={{ left: 0, right: 10, top: 10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="areaPenjualan" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3d7fc8" stopOpacity={0.35} />
                        <stop offset="100%" stopColor="#3d7fc8" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid vertical={false} stroke="#eee" />
                    <XAxis
                      dataKey="tanggal"
                      tick={{ fontSize: 12, fill: "#848484" }}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("id-ID", { day: "numeric", month: "short" })
                      }
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#848484" }}
                      tickFormatter={(v) => formatRupiahRingkas(Number(v))}
                      width={50}
                    />
                    <Tooltip
                      formatter={((value: unknown) => formatRupiah(Number(value))) as never}
                      labelFormatter={((v: unknown) =>
                        new Date(v as string).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })) as never}
                    />
                    <Area
                      type="monotone"
                      dataKey="totalMasuk"
                      stroke="#081937"
                      strokeWidth={3}
                      fill="url(#areaPenjualan)"
                      connectNulls
                      dot={{ r: 4, stroke: "#081937", strokeWidth: 2, fill: "#fff" }}
                      activeDot={{ r: 6 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
                {hanyaSatuTitik && (
                  <p className="mt-2 text-xs text-gray-400">
                    Cuma ada 1 hari data di periode ini, makanya belum kelihatan garis. Pilih rentang tanggal lebih dari 1 hari biar grafiknya kelihatan.
                  </p>
                )}
              </>
            )}
          </div>
        </article>

        <article className="rounded-[30px] bg-white p-6 shadow-lg">
          <h3 className="text-base text-black">Produk Terlaris</h3>
          <div className="mt-6 flex flex-col gap-4">
            {produkTerlarisPeriode.length === 0 ? (
              <p className="text-sm text-gray-500">
                {loadingPeriode ? "Memuat..." : "Belum cukup data pada periode ini."}
              </p>
            ) : (
              produkTerlarisPeriode.slice(0, 6).map((p) => {
                const persen = Math.max((p.jumlahTerjual / maxJumlahTerjual) * 100, 14);
                return (
                  <div key={p.namaProduk} className="flex items-center gap-3">
                    <span className="w-24 shrink-0 truncate text-right text-sm text-[#848484]">
                      {p.namaProduk}
                    </span>
                    <div className="h-4 flex-1 rounded-full bg-gray-100">
                      <div
                        className="flex h-4 items-center justify-end rounded-r-full bg-[#081937] px-2"
                        style={{ width: `${persen}%` }}
                      >
                        <span className="text-[10px] font-medium text-white">
                          {p.jumlahTerjual}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </article>
      </section>

      {/* Produk terlaris all-time — tidak ada di desain Figma, tetap
          dipertahankan karena sudah jadi bagian requirement */}
      <section className="mt-6 rounded-[30px] bg-white p-6 shadow-lg" aria-label="Produk terlaris sepanjang waktu">
        <h3 className="text-base text-black">Produk/Layanan Terlaris (All-Time)</h3>
        <p className="mt-1 text-xs text-gray-400">
          Tidak terpengaruh filter tanggal di atas — dihitung dari seluruh riwayat transaksi sejak awal.
        </p>
        <div className="mt-4 space-y-2">
          {produkTerlarisAllTime.length === 0 ? (
            <p className="text-sm text-gray-500">Belum ada data transaksi.</p>
          ) : (
            produkTerlarisAllTime.map((p) => (
              <div key={p.namaProduk} className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">{p.namaProduk}</p>
                  <p className="text-sm text-gray-500">
                    Terjual {p.jumlahTerjual} {p.satuan} — Omzet {formatRupiah(p.omzet)}
                  </p>
                </div>
                <div className="text-right">
                  {p.margin !== null ? (
                    <p className="text-sm">
                      <span className="text-gray-500">Margin: </span>
                      <span className="font-medium">{formatRupiah(p.margin)}</span>
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Margin belum diketahui</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
}