"use client";

export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Apagar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="font-heading mb-1 text-lg tracking-[0.03em] text-[var(--blue)]">{title}</h2>
        <p className="mb-5 text-[0.85rem] leading-relaxed text-[var(--gray)]">{message}</p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border-[1.5px] border-[var(--gray-light)] py-3 text-[0.85rem] font-semibold text-[var(--text)] transition-colors hover:border-[var(--blue-light)]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-xl bg-[var(--red)] py-3 text-[0.85rem] font-semibold text-white transition-all hover:bg-[var(--red-dark)]"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
