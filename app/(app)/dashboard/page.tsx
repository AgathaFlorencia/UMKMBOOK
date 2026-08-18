// ============================================================
// HALAMAN: DASHBOARD (/dashboard)
// ============================================================
// Sekarang jadi PUSAT INFORMASI utama, gabungan dari:
// 1. Ringkasan Hari Ini (arus kas harian, tetap seperti sebelumnya)
// 2. Filter Periode (satu tanggal ATAU rentang tanggal, bebas pilih)
// 3. Grafik & ringkasan angka SESUAI periode yang difilter
// 4. Produk Terlaris SESUAI periode yang difilter
// 5. Produk Terlaris ALL-TIME (tidak terpengaruh filter, selalu
//    dari seluruh riwayat)
//
// "use client" karena ada interaksi filter tanggal yang mengubah
// data yang ditampilkan secara langsung (tanpa reload halaman).
//
// Proteksi login untuk halaman ini diatur terpusat di middleware.ts.
// Sebelumnya halaman ini ada di "/", sekarang dipindah ke "/dashboard"
// supaya "/" bisa dipakai Landing Page publik.

"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { getRingkasanHariIni, type RingkasanHariIni } from "@/lib/dashboard";
import {
  getRingkasanPeriode,
  getGrafikPenjualanHarian,
  getProdukTerlarisPeriode,
  getProdukTerlarisAllTime,
  type RingkasanPeriode,
  type TitikGrafikHarian,
  type ProdukTerlaris,
} from "@/lib/laporan";
import { formatRupiah } from "@/lib/format";

// ------------------------------------------------------------
// Helper tanggal (buat preset filter & default awal buka halaman)
// ------------------------------------------------------------

function keFormatTanggal(d: Date): string {
  return d.toISOString().split("T")[0];
}

function presetHariIni() {
  const hari = keFormatTanggal(new Date());
  return { dari: hari, sampai: hari };
}

function preset7HariTerakhir() {
  const sekarang = new Date();
  const tujuhHariLalu = new Date(sekarang);
  tujuhHariLalu.setDate(sekarang.getDate() - 6);
  return {
    dari: keFormatTanggal(tujuhHariLalu),
    sampai: keFormatTanggal(sekarang),
  };
}

function presetBulanIni() {
  const sekarang = new Date();
  const awalBulan = new Date(sekarang.getFullYear(), sekarang.getMonth(), 1);
  return {
    dari: keFormatTanggal(awalBulan),
    sampai: keFormatTanggal(sekarang),
  };
}

export default function DashboardPage() {
  // Bagian 1: ringkasan hari ini
  const [ringkasanHariIni, setRingkasanHariIni] = useState<RingkasanHariIni | null>(null);

  // Bagian 2: filter tanggal (default: Bulan Ini)
  const defaultPeriode = presetBulanIni();
  const [dari, setDari] = useState(defaultPeriode.dari);
  const [sampai, setSampai] = useState(defaultPeriode.sampai);

  // Bagian 3 & 4: data yang berubah sesuai filter
  const [ringkasanPeriode, setRingkasanPeriode] = useState<RingkasanPeriode | null>(null);
  const [grafik, setGrafik] = useState<TitikGrafikHarian[]>([]);
  const [produkTerlarisPeriode, setProdukTerlarisPeriode] = useState<ProdukTerlaris[]>([]);
  const [loadingPeriode, setLoadingPeriode] = useState(true);

  // Bagian 5: produk terlaris all-time (dimuat sekali saja)
  const [produkTerlarisAllTime, setProdukTerlarisAllTime] = useState<ProdukTerlaris[]>([]);

  // Muat ringkasan hari ini + all-time SEKALI waktu halaman dibuka
  useEffect(() => {
    getRingkasanHariIni().then(setRingkasanHariIni);
    getProdukTerlarisAllTime().then(setProdukTerlarisAllTime);
  }, []);

  // Muat ulang data periode SETIAP KALI filter tanggal berubah
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

  function terapkanPreset(preset: { dari: string; sampai: string }) {
    setDari(preset.dari);
    setSampai(preset.sampai);
  }

  return (
    <main className="min-h-screen p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* ============ BAGIAN 1: RINGKASAN HARI INI ============ */}
        <section className="grid grid-cols-3 gap-4 mb-4">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Masuk hari ini</p>
            <p className="text-xl font-semibold">
              {ringkasanHariIni ? formatRupiah(ringkasanHariIni.totalMasuk) : "..."}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Keluar hari ini</p>
            <p className="text-xl font-semibold">
              {ringkasanHariIni ? formatRupiah(ringkasanHariIni.totalKeluar) : "..."}
            </p>
          </div>
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Untung hari ini</p>
            <p className="text-xl font-semibold">
              {ringkasanHariIni ? formatRupiah(ringkasanHariIni.untung) : "..."}
            </p>
          </div>
        </section>

        <a
          href="/transaksi"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium"
        >
          + Catat Transaksi
        </a>
      </div>

      {/* ============ BAGIAN 2: FILTER PERIODE ============ */}
      <section className="border-t pt-6">
        <h2 className="font-semibold mb-3">Laporan Periode</h2>

        <div className="flex gap-2 mb-3 flex-wrap">
          <button
            onClick={() => terapkanPreset(presetHariIni())}
            className="text-xs px-3 py-1.5 rounded-full border"
          >
            Hari Ini
          </button>
          <button
            onClick={() => terapkanPreset(preset7HariTerakhir())}
            className="text-xs px-3 py-1.5 rounded-full border"
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => terapkanPreset(presetBulanIni())}
            className="text-xs px-3 py-1.5 rounded-full border"
          >
            Bulan Ini
          </button>
        </div>

        <div className="flex gap-3 items-end flex-wrap">
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Dari tanggal
            </label>
            <input
              type="date"
              value={dari}
              onChange={(e) => setDari(e.target.value)}
              className="border rounded-lg p-2 text-sm"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-1">
              Sampai tanggal
            </label>
            <input
              type="date"
              value={sampai}
              onChange={(e) => setSampai(e.target.value)}
              className="border rounded-lg p-2 text-sm"
            />
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Tips: isi tanggal &quot;Dari&quot; dan &quot;Sampai&quot; dengan
          tanggal yang sama untuk melihat laporan satu hari saja.
        </p>
      </section>

      {/* ============ BAGIAN 3: GRAFIK & RINGKASAN PERIODE ============ */}
      <section>
        {loadingPeriode || !ringkasanPeriode ? (
          <p className="text-gray-500 text-sm">Memuat...</p>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
              <div className="border rounded-lg p-4">
                <p className="text-gray-500">Total Penjualan</p>
                <p className="text-lg font-semibold">
                  {formatRupiah(ringkasanPeriode.totalMasuk)}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-gray-500">Jumlah Transaksi</p>
                <p className="text-lg font-semibold">
                  {ringkasanPeriode.jumlahTransaksi}
                </p>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-gray-500">Total Produk Terjual</p>
                <p className="text-lg font-semibold">
                  {ringkasanPeriode.totalProdukTerjual}
                </p>
              </div>
            </div>

            {grafik.length === 0 ? (
              <p className="text-gray-500 text-sm">
                Belum ada penjualan di periode ini.
              </p>
            ) : (
              <div className="border rounded-lg p-4" style={{ height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={grafik}>
                    <XAxis
                      dataKey="tanggal"
                      tick={{ fontSize: 11 }}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })
                      }
                    />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip
                      formatter={((value: unknown) =>
                        formatRupiah(Number(value))) as never}
                      labelFormatter={((v: unknown) =>
                        new Date(v as string).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })) as never}
                    />
                    <Bar dataKey="totalMasuk" fill="#000000" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </>
        )}
      </section>

      {/* ============ BAGIAN 4: PRODUK TERLARIS (SESUAI PERIODE) ============ */}
      <section>
        <h2 className="font-semibold mb-3">
          Produk/Layanan Terlaris (Periode Terpilih)
        </h2>
        <DaftarProdukTerlaris data={produkTerlarisPeriode} kosongText="Belum cukup data pada periode ini." />
      </section>

      {/* ============ BAGIAN 5: PRODUK TERLARIS ALL-TIME ============ */}
      <section className="border-t pt-6">
        <h2 className="font-semibold mb-1">Produk/Layanan Terlaris (All-Time)</h2>
        <p className="text-xs text-gray-400 mb-3">
          Tidak terpengaruh filter tanggal di atas — dihitung dari
          seluruh riwayat transaksi sejak awal.
        </p>
        <DaftarProdukTerlaris data={produkTerlarisAllTime} kosongText="Belum ada data transaksi." />
      </section>
    </main>
  );
}

// Komponen kecil dipakai bareng buat Bagian 4 & 5 (bentuknya sama,
// cuma sumber datanya beda)
function DaftarProdukTerlaris({
  data,
  kosongText,
}: {
  data: ProdukTerlaris[];
  kosongText: string;
}) {
  if (data.length === 0) {
    return <p className="text-gray-500 text-sm">{kosongText}</p>;
  }

  return (
    <div className="space-y-2">
      {data.map((p) => (
        <div
          key={p.namaProduk}
          className="border rounded-lg p-4 flex items-center justify-between"
        >
          <div>
            <p className="font-medium">{p.namaProduk}</p>
            <p className="text-sm text-gray-500">
              Terjual {p.jumlahTerjual} {p.satuan} — Omzet{" "}
              {formatRupiah(p.omzet)}
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
      ))}
    </div>
  );
}