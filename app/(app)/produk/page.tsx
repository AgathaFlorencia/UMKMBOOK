"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  getDaftarProduk,
  updateProduk,
  deleteProduk,
  type Produk,
} from "@/lib/produk";
import { getProfilToko, type ProfilToko } from "@/lib/profil";
import { formatRupiah } from "@/lib/format";

export default function ProdukPage() {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<"default" | "asc" | "desc">("default");
  const [editingProduk, setEditingProduk] = useState<Produk | null>(null);
  const [deletingProduk, setDeletingProduk] = useState<Produk | null>(null);
  const [profil, setProfil] = useState<ProfilToko | null>(null);

  useEffect(() => {
    getDaftarProduk().then((data) => {
      setDaftarProduk(data);
      setLoading(false);
    });
    getProfilToko().then(setProfil);
  }, []);

  const visibleProduk = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase("id-ID");
    const filtered = daftarProduk.filter((p) =>
      p.nama_produk.toLocaleLowerCase("id-ID").includes(query)
    );

    if (sortOrder === "default") return filtered;

    return [...filtered].sort((a, b) =>
      sortOrder === "asc"
        ? a.harga_terbaru - b.harga_terbaru
        : b.harga_terbaru - a.harga_terbaru
    );
  }, [daftarProduk, searchQuery, sortOrder]);

  function handleSaved(updated: Produk) {
    setDaftarProduk((current) =>
      current.map((p) => (p.id === updated.id ? updated : p))
    );
    setEditingProduk(null);
  }

  function handleDeleted(deletedId: string) {
    setDaftarProduk((current) => current.filter((p) => p.id !== deletedId));
    setDeletingProduk(null);
  }

  return (
    <main
      className="relative min-h-screen w-full overflow-hidden rounded-tl-[30px] rounded-bl-[30px] bg-[linear-gradient(235deg,rgba(31,104,186,1)_0%,rgba(61,127,200,1)_63%)] p-6 md:p-8"
      aria-label="Halaman Produk"
    >
      {/* Search + profil usaha */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <form
          className="flex w-full max-w-[520px] items-center gap-2.5 rounded-3xl bg-white px-[18px] py-2.5"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <Image src="/dashboard/search.png" alt="" width={22} height={22} aria-hidden="true" />
          <label className="sr-only" htmlFor="produk-search">
            Cari produk
          </label>
          <input
            id="produk-search"
            className="h-[22px] w-full border-0 bg-transparent text-lg text-black outline-none placeholder:text-[#b7b7b7]"
            placeholder="Search"
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>

        <div className="flex items-center gap-2.5 self-end md:self-auto">
          <div className="flex h-[41px] w-[41px] items-center justify-center rounded-full bg-white/30 text-sm font-semibold text-white">
            {profil?.namaUsaha ? profil.namaUsaha.charAt(0).toUpperCase() : "A"}
          </div>
          <div className="flex flex-col gap-0.5 text-white">
            <span className="text-[10px] font-semibold">
              {profil?.namaUsaha ?? "..."}
            </span>
            <span className="text-[10px] font-semibold">
              {profil?.email ?? ""}
            </span>
          </div>
        </div>
      </div>

      {/* Judul + filter */}
      <div className="mt-8 flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-white md:text-[40px]">Produk</h1>

        <div className="relative">
          <button
            type="button"
            className="flex items-center justify-center gap-2.5 rounded-2xl bg-white px-4 py-2.5"
            aria-expanded={isFilterOpen}
            aria-controls="produk-filter-options"
            onClick={() => setIsFilterOpen((open) => !open)}
          >
            <Image src="/dashboard/filter.png" alt="" width={22} height={22} aria-hidden="true" />
            <span className="text-[15px] font-semibold text-black">Filter</span>
          </button>

          {isFilterOpen && (
            <div
              id="produk-filter-options"
              className="absolute right-0 top-[48px] z-10 w-[180px] rounded-2xl bg-white p-3 shadow-[4px_4px_12px_#00000040]"
            >
              <p className="mb-2 text-[13px] font-semibold text-black">Urutkan Harga</p>
              <div className="flex flex-col gap-1">
                {[
                  { value: "default", label: "Default" },
                  { value: "asc", label: "Terendah" },
                  { value: "desc", label: "Tertinggi" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`rounded-lg px-2 py-1 text-left text-[13px] ${
                      sortOrder === option.value
                        ? "bg-[#e8f1fc] text-[#1f68ba]"
                        : "text-black"
                    }`}
                    onClick={() => {
                      setSortOrder(option.value as "default" | "asc" | "desc");
                      setIsFilterOpen(false);
                    }}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="mt-2 max-w-xl text-sm text-white/80">
        Mengubah harga di sini hanya berlaku untuk transaksi baru ke depan.
        Transaksi yang sudah tercatat tidak akan berubah.
      </p>

      {/* Tabel produk */}
      <section className="mt-6 overflow-hidden rounded-2xl bg-white" aria-label="Daftar produk">
        <table className="w-full table-fixed border-collapse">
          <caption className="sr-only">Daftar produk dan harga jual</caption>
          <colgroup>
            <col className="w-1/3" />
            <col className="w-1/3" />
            <col className="w-1/3" />
          </colgroup>
          <thead>
            <tr>
              <th scope="col" className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]">
                Nama Produk
              </th>
              <th scope="col" className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]">
                Harga Jual
              </th>
              <th scope="col" className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-[#848484]">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-sm text-gray-500">
                  Memuat...
                </td>
              </tr>
            )}
            {!loading && visibleProduk.length === 0 && (
              <tr>
                <td colSpan={3} className="p-6 text-center text-sm text-gray-500">
                  Belum ada produk. Produk otomatis muncul di sini setelah transaksi pertama.
                </td>
              </tr>
            )}
            {visibleProduk.map((item) => (
              <tr key={item.id}>
                <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-black">
                  {item.nama_produk}{" "}
                  <span className="text-xs font-normal text-gray-400">/ {item.satuan}</span>
                </td>
                <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4 text-center text-[15px] font-semibold text-black">
                  {formatRupiah(item.harga_terbaru)}
                </td>
                <td className="h-[51px] border-b border-[#bababa] px-[18px] py-4">
                  <div className="flex items-center justify-center gap-3">
                    <button
                      type="button"
                      className="flex h-[18px] w-[18px] items-center justify-center"
                      aria-label={`Edit ${item.nama_produk}`}
                      onClick={() => setEditingProduk(item)}
                    >
                      <Image src="/dashboard/edit-pencil.png" alt="" width={18} height={18} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className="flex h-[18px] w-[18px] items-center justify-center"
                      aria-label={`Hapus ${item.nama_produk}`}
                      onClick={() => setDeletingProduk(item)}
                    >
                      <Image src="/dashboard/delete.png" alt="" width={18} height={18} aria-hidden="true" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {editingProduk && (
        <EditProdukModal
          produk={editingProduk}
          onClose={() => setEditingProduk(null)}
          onSaved={handleSaved}
        />
      )}

      {deletingProduk && (
        <DeleteProdukModal
          produk={deletingProduk}
          onClose={() => setDeletingProduk(null)}
          onDeleted={handleDeleted}
        />
      )}
    </main>
  );
}

function EditProdukModal({
  produk,
  onClose,
  onSaved,
}: {
  produk: Produk;
  onClose: () => void;
  onSaved: (updated: Produk) => void;
}) {
  const [harga, setHarga] = useState(String(produk.harga_terbaru));
  const [modal, setModal] = useState(
    produk.modal_per_unit != null ? String(produk.modal_per_unit) : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const hargaBaru = parseFloat(harga);
    const modalBaru = modal === "" ? null : parseFloat(modal);

    if (!Number.isFinite(hargaBaru) || hargaBaru < 0) {
      setError("Harga jual tidak valid.");
      return;
    }

    setSaving(true);
    const hasil = await updateProduk(produk.id, {
      hargaTerbaru: hargaBaru,
      modalPerUnit: modalBaru,
    });
    setSaving(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Gagal menyimpan.");
      return;
    }

    onSaved({ ...produk, harga_terbaru: hargaBaru, modal_per_unit: modalBaru });
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-produk-title"
      onClick={onClose}
    >
      <form
        className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSubmit}
      >
        <div className="flex items-center justify-between">
          <h2 id="edit-produk-title" className="text-xl font-semibold text-black">
            Edit Produk
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
          {produk.nama_produk}{" "}
          <span className="text-xs text-gray-400">/ {produk.satuan}</span>
        </p>

        <div className="mt-5">
          <label className="mb-1 block text-sm text-black" htmlFor="edit-harga">
            Harga Jual
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-[#dadada] px-3 py-2 focus-within:border-[#1f68ba]">
            <span className="text-sm text-gray-400">Rp</span>
            <input
              id="edit-harga"
              type="number"
              min="0"
              className="w-full border-0 bg-transparent text-sm text-black outline-none"
              value={harga}
              onChange={(e) => setHarga(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-1 block text-sm text-black" htmlFor="edit-modal">
            Modal per Unit{" "}
            <span className="text-xs text-gray-400">(opsional, khusus reseller)</span>
          </label>
          <div className="flex items-center gap-2 rounded-xl border border-[#dadada] px-3 py-2 focus-within:border-[#1f68ba]">
            <span className="text-sm text-gray-400">Rp</span>
            <input
              id="edit-modal"
              type="number"
              min="0"
              className="w-full border-0 bg-transparent text-sm text-black outline-none"
              placeholder="Khusus reseller"
              value={modal}
              onChange={(e) => setModal(e.target.value)}
            />
          </div>
        </div>

        <p className="mt-3 text-xs text-gray-400">
          Perubahan hanya berlaku untuk transaksi baru. Transaksi yang sudah
          tercatat tidak berubah.
        </p>

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

function DeleteProdukModal({
  produk,
  onClose,
  onDeleted,
}: {
  produk: Produk;
  onClose: () => void;
  onDeleted: (deletedId: string) => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleConfirm() {
    setDeleting(true);
    setError("");

    const hasil = await deleteProduk(produk.id);
    setDeleting(false);

    if (!hasil.success) {
      setError(hasil.error ?? "Gagal menghapus produk.");
      return;
    }

    onDeleted(produk.id);
  }

  return (
    <div
      className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-produk-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[380px] rounded-[24px] bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 id="delete-produk-title" className="text-xl font-semibold text-black">
            Hapus Produk
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

        <p className="mt-3 text-sm text-gray-600">
          Yakin mau hapus{" "}
          <span className="font-semibold text-black">{produk.nama_produk}</span>{" "}
          <span className="text-xs text-gray-400">/ {produk.satuan}</span>? Produk
          yang sudah dihapus tidak bisa dikembalikan, tapi transaksi yang sudah
          tercatat tidak akan berubah.
        </p>

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
            type="button"
            disabled={deleting}
            onClick={handleConfirm}
            className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {deleting ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}