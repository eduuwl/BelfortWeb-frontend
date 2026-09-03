"use client";

export default function Pagination({
  page,
  total,
  limit,
  onChange,
  disabled,
}: {
  page: number;
  total: number;
  limit: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  if (totalPages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <button
        type="button"
        disabled={disabled || page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-lg border-[1.5px] border-[var(--gray-light)] px-4 py-2 text-[0.8rem] font-semibold text-[var(--text)] transition-colors hover:border-[var(--blue-light)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        ← Anterior
      </button>
      <span className="text-[0.78rem] text-[var(--gray)]">
        Página {page} de {totalPages} · {total} registro{total === 1 ? "" : "s"}
      </span>
      <button
        type="button"
        disabled={disabled || page >= totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded-lg border-[1.5px] border-[var(--gray-light)] px-4 py-2 text-[0.8rem] font-semibold text-[var(--text)] transition-colors hover:border-[var(--blue-light)] disabled:cursor-not-allowed disabled:opacity-45"
      >
        Próxima →
      </button>
    </div>
  );
}
