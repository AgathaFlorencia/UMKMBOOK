export function formatRupiah(angka: number): string {
  return "Rp" + angka.toLocaleString("id-ID");
}