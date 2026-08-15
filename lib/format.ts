// ============================================================
// LIB: FORMAT (helper kecil, dipakai di banyak halaman)
// ============================================================
// Ubah angka biasa (15000) jadi format Rupiah yang gampang
// dibaca (Rp15.000).

export function formatRupiah(angka: number): string {
  return "Rp" + angka.toLocaleString("id-ID");
}