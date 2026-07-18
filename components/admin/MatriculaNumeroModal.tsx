"use client";

import { useState } from "react";

export default function MatriculaNumeroModal({
  nome,
  onClose,
  onConfirm,
}: {
  nome: string;
  onClose: () => void;
  onConfirm: (numero: string) => void;
}) {
  const [numero, setNumero] = useState("");

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-2xl">
        <h2 className="font-heading mb-1 text-lg tracking-[0.03em] text-[var(--blue)]">Número da matrícula</h2>
        <p className="mb-4 text-[0.82rem] leading-relaxed text-[var(--gray)]">
          Digite o número de matrícula de <strong>{nome}</strong> antes de enviar a confirmação.
        </p>

        <input
          autoFocus
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Ex: 0451"
          className="mb-4 w-full rounded-[10px] border-[1.5px] border-[var(--gray-light)] px-4 py-3 text-[0.95rem] outline-none transition-all focus:border-[var(--blue-light)]"
        />

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border-[1.5px] border-[var(--gray-light)] py-3 text-[0.85rem] font-semibold text-[var(--text)] transition-colors hover:border-[var(--blue-light)]"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!numero.trim()}
            onClick={() => onConfirm(numero.trim())}
            className="flex-1 rounded-xl bg-[var(--red)] py-3 text-[0.85rem] font-semibold text-white transition-all hover:bg-[var(--red-dark)] disabled:cursor-not-allowed disabled:opacity-45"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
