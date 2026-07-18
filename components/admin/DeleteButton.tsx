"use client";

import { TrashIcon } from "@heroicons/react/24/solid";

export default function DeleteButton({ onClick, title }: { onClick: () => void; title?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title ?? "Apagar registro"}
      aria-label={title ?? "Apagar registro"}
      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[var(--red)]/30 text-[var(--red)] transition-colors hover:border-[var(--red)] hover:bg-[var(--red)] hover:text-white"
    >
      <TrashIcon className="h-4 w-4" />
    </button>
  );
}
