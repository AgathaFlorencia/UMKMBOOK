// ============================================================
// KOMPONEN: MODAL KONFIRMASI (bisa dipakai ulang di halaman lain)
// ============================================================
// Modal generik buat konfirmasi aksi yang gak bisa di-undo gampang
// (misal: tandai kasbon lunas). Dibikin custom (bukan window.confirm
// bawaan browser) biar tampilannya konsisten sama desain UMKMBook.

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Ya, Konfirmasi",
  cancelLabel = "Batal",
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay gelap di belakang modal, klik di luar = batal */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
      />

      <div className="relative bg-white rounded-lg p-6 w-full max-w-sm mx-4 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-6">{message}</p>

        <div className="flex gap-2 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border text-sm"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-black text-white text-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}