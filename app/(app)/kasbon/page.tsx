"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Image from "next/image";
import {
  getDaftarKasbon,
  tambahKasbon,
  updateKasbon,
  type Kasbon,
} from "@/lib/kasbon";
import { formatRupiah } from "@/lib/format";

function formatTanggal(tanggal: string) {
  return new Date(tanggal).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function KasbonPage() {
  const [daftarKasbon, setDaftarKasbon] = useState<Kasbon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [addingOpen, setAddingOpen] = useState(false);
  const [editingKasbon, setEditingKasbon] = useState<Kasbon | null>(null);

  async function muatUlang() {
    const data = await getDaftarKasbon();
    setDaftarKasbon(data);
    setLoading(false);
  }

  useEffect(() => {
    muatUlang();
  }, []);

  const visibleKasbon = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id-ID");
    if (!query) return daftarKasbon;
    return daftarKasbon.filter((k) =>
      k.nama_pelanggan.toLocaleLowerCase("id-ID").includes(query)
    );
  }, [daftarKasbon, searchQuery]);

  function handleAdded(baru: Kasbon) {
    setDaftarKasbon((current) => [baru, ...current]);
    setAddingOpen(false);
  }

  function handleUpdated(updated: Kasbon) {
    setDaftarKasbon((current) =>
      current.map((k) => (k.id === updated.id ? updated : k))
    );
    setEditingKasbon(null);
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6 md:p-8"
      aria-label="Halaman Kasbon"
    >
      {/* Judul */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-white md:text-[40px]">
          Kasbon
        </h1>
        <p className="mt-1 text-sm text-white/80">
          Tunggakan pembayaran pelanggan
        </p>
      </div>

      {/* Search + tombol tambah */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          className="flex w-full max-w-[420px] items-center gap-2.5 rounded-3xl bg-white px-[18px] py-2.5"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <Image
            src="/dashboard/search.png"
            alt=""
            width={22}
            height={22}
            aria-hidden="true"
          />
          <label className="sr-only" htmlFor="kasbon-search">
            Cari pelanggan
          </label>
          <input
            id="kasbon-search"
            className="h-[22px] w-full border-0 bg-transparent text-sm text-black outline-none placeholder:text-[#b7b7b7]"
            placeholder="Search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <button
          type="button"
          onClick={() => setAddingOpen(true)}
          className="flex items-center justify-center gap-2 self-end rounded-2xl bg-white px-4 py-2.5 text-[15px] font-semibold text-black md:self-auto"
        >
          <span className="text-lg leading-none">+</span> Tambah Piutang
        </button>
      </div>

      {/* Tabel kasbon */}
      <section
        className="mt-6 overflow-hidden rounded-2xl bg-white"
        aria-label="Daftar kasbon"
      >
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Daftar utang pelanggan</caption>
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[20%]" />
          </colgroup>
          <thead>
            <tr>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Nama
              </th>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Nilai Utang
              </th>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Dibayarkan
              </th>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Kurang
              </th>
              <th
                scope="col"
                className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && visibleKasbon.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm text-gray-500">
                  Belum ada catatan kasbon.
                </td>
              </tr>
            )}
            {visibleKasbon.map((k) => {
              const kurang = Math.max(k.jumlah_utang - k.dibayarkan, 0);
              const lunas = k.status === "lunas";
              return (
                <tr key={k.id}>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-black">
                    {k.nama_pelanggan}
                  </td>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-sm text-black">
                    {formatTanggal(k.tanggal)}
                  </td>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-sm font-semibold text-red-500">
                    {formatRupiah(k.jumlah_utang)}
                  </td>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-sm font-semibold text-green-600">
                    {formatRupiah(k.dibayarkan)}
                  </td>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-sm font-semibold text-black">
                    {formatRupiah(kurang)}
                  </td>
                  <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        type="button"
                        className="flex h-[18px] w-[18px] items-center justify-center"
                        aria-label={`Edit ${k.nama_pelanggan}`}
                        onClick={() => setEditingKasbon(k)}
                      >
                        <Image
                          src="/dashboard/edit-pencil.png"
                          alt=""
                          width={18}
                          height={18}
                          aria-hidden="true"
                        />
                      </button>
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          lunas
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {lunas ? "Lunas" : "Belum Lunas"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {addingOpen && (
        <TambahKasbonModal
          onClose={() => setAddingOpen(false)}
          onAdded={handleAdded}
        />
      )}

      {editingKasbon && (
        <EditKasbonModal
          kasbon={editingKasbon}
          onClose={() => setEditingKasbon(null)}
          onSaved={handleUpdated}
        />
      )}
    </main>
  );
}

function TambahKasbonModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: (baru: Kasbon) => void;
}) {
  const [namaPelanggan, setNamaPelanggan] = useState("");
  const [jumlahUtang, setJumlahUtang] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const nilai = parseFloat(jumlahUtang);
    if (!Number.isFinite(nilai) || nilai <= 0) {
      setError("Nilai utang tidak valid.");
      return;
    }

    setSaving(true);
    const hasil = await tambahKasbon({
      namaPelanggan,
      jumlahUtang: nilai,
    });
    setSaving(false);

    if (!hasil.success || !hasil.data) {
      setError(hasil.error ?? "Gagal menyimpan.");
      return;
    }

    onAdded(hasil.data);
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tambah-kasbon-title"
      onClick={onClose}
    >
      <form
        className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 id="tambah-kasbon-title" className="text-xl font-semibold text-black">
            Tambah Piutang
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#999999] hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-black" htmlFor="tambah-nama">
            Nama Pelanggan
          </label>
          <input
            id="tambah-nama"
            type="text"
            className="w-full rounded-xl border border-[#dadada] px-3 py-2 text-sm text-black outline-none focus:border-[#1f68ba]"
            value={namaPelanggan}
            onChange={(e) => setNamaPelanggan(e.target.value)}
            required
          />
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-black" htmlFor="tambah-jumlah">
            Nilai Utang
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-[#dadada] px-3 py-2 focus-within:border-[#1f68ba]">
            <span className="text-sm text-gray-400">Rp</span>
            <input
              id="tambah-jumlah"
              type="number"
              min="0"
              className="w-full border-0 bg-transparent text-sm text-black outline-none"
              value={jumlahUtang}
              onChange={(e) => setJumlahUtang(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-semibold text-[#1f68ba]"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[linear-gradient(90deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function EditKasbonModal({
  kasbon,
  onClose,
  onSaved,
}: {
  kasbon: Kasbon;
  onClose: () => void;
  onSaved: (updated: Kasbon) => void;
}) {
  const [dibayarkan, setDibayarkan] = useState(String(kasbon.dibayarkan));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const nilaiDibayarkan = parseFloat(dibayarkan) || 0;
  const kurang = Math.max(kasbon.jumlah_utang - nilaiDibayarkan, 0);

  async function simpan(statusBaru: "lunas" | "belum_lunas") {
    setError("");

    const jumlahAkhir =
      statusBaru === "lunas" ? kasbon.jumlah_utang : nilaiDibayarkan;

    if (!Number.isFinite(jumlahAkhir) || jumlahAkhir < 0) {
      setError("Jumlah dibayarkan tidak valid.");
      return;
    }

    setSaving(true);
    const hasil = await updateKasbon(kasbon.id, {
      dibayarkan: jumlahAkhir,
      status: statusBaru,
    });
    setSaving(false);

    if (!hasil.success || !hasil.data) {
      setError(hasil.error ?? "Gagal menyimpan.");
      return;
    }

    onSaved(hasil.data);
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-kasbon-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="edit-kasbon-title" className="text-xl font-semibold text-black">
            Update Pembayaran
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup"
            className="flex h-7 w-7 items-center justify-center rounded-full text-[#999999] hover:bg-gray-100 hover:text-black"
          >
            ✕
          </button>
        </div>

        <p className="mt-1 text-sm text-gray-500">
          {kasbon.nama_pelanggan}{" "}
          <span className="text-xs text-gray-400">
            / {formatRupiah(kasbon.jumlah_utang)}
          </span>
        </p>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-black" htmlFor="edit-dibayarkan">
            Dibayarkan
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-[#dadada] px-3 py-2 focus-within:border-[#1f68ba]">
            <span className="text-sm text-gray-400">Rp</span>
            <input
              id="edit-dibayarkan"
              type="number"
              min="0"
              max={kasbon.jumlah_utang}
              className="w-full border-0 bg-transparent text-sm text-black outline-none"
              value={dibayarkan}
              onChange={(e) => setDibayarkan(e.target.value)}
            />
          </div>
        </div>

        <p className="mt-3 text-sm text-black">
          Kurang: <span className="font-semibold">{formatRupiah(kurang)}</span>
        </p>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}

        <div className="mt-6 flex flex-col gap-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => simpan("belum_lunas")}
            className="rounded-xl border border-[#1f68ba] px-4 py-2 text-sm font-semibold text-[#1f68ba] disabled:opacity-50"
          >
            {saving ? "Menyimpan..." : "Simpan Pembayaran"}
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => simpan("lunas")}
            className="rounded-xl bg-[linear-gradient(90deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            Tandai Lunas
          </button>
        </div>
      </div>
    </div>
  );
}
