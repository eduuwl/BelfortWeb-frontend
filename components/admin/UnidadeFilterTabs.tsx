"use client";

import type { Unidade } from "@/lib/planos";

const UNIDADES: { value: Unidade; label: string }[] = [
  { value: "telegrafo", label: "Telégrafo" },
  { value: "sacramenta", label: "Sacramenta" },
];

export default function UnidadeFilterTabs({
  unidade,
  onChange,
}: {
  unidade: Unidade;
  onChange: (u: Unidade) => void;
}) {
  return (
    <div className="mb-4 inline-flex gap-1 rounded-xl border border-[var(--gray-light)] bg-white p-1">
      {UNIDADES.map((u) => (
        <button
          key={u.value}
          type="button"
          onClick={() => onChange(u.value)}
          className={`rounded-lg px-4 py-2 text-[0.8rem] font-semibold transition-colors ${
            unidade === u.value
              ? "bg-[var(--blue)] text-white"
              : "text-[var(--gray)] hover:text-[var(--blue)]"
          }`}
        >
          {u.label}
        </button>
      ))}
    </div>
  );
}
