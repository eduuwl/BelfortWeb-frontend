"use client";

import { useState } from "react";
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import type { MatriculaRecord } from "@/lib/adminApi";

function CopyField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard indisponível (ex: contexto sem permissão) — ignora silenciosamente.
    }
  }

  return (
    <div className="flex items-center justify-between gap-3 border-b border-[var(--gray-light)] py-3 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--gray)]">{label}</div>
        <div className="truncate text-[0.9rem] text-[var(--text)]">{value || "—"}</div>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        disabled={!value}
        title="Copiar"
        aria-label={`Copiar ${label}`}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-[var(--gray-light)] text-[var(--gray)] transition-colors hover:border-[var(--blue)] hover:text-[var(--blue)] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {copied ? (
          <ClipboardDocumentCheckIcon className="h-4 w-4 text-[#166534]" />
        ) : (
          <ClipboardDocumentIcon className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

export default function MatriculaDetalheModal({
  matricula,
  onClose,
}: {
  matricula: MatriculaRecord;
  onClose: () => void;
}) {
  const fields: { label: string; value: string }[] = [
    { label: "Nome", value: matricula.nome },
    { label: "Data de nascimento", value: matricula.nascimento },
    { label: "E-mail", value: matricula.email },
    { label: "CPF", value: matricula.cpf },
    { label: "Endereço", value: matricula.endereco },
    { label: "WhatsApp", value: matricula.whatsapp },
    { label: "Instagram", value: matricula.instagram },
    { label: "Limitação física", value: matricula.limitacao },
    { label: "Modalidade", value: matricula.modalidade },
    { label: "Unidade", value: matricula.unidade },
    { label: "Horário", value: matricula.horario },
    { label: "CREF (personal externo)", value: matricula.cref },
    { label: "Plano", value: matricula.plano },
    { label: "Aceite do termo", value: matricula.aceite },
    { label: "Cadastrado em", value: new Date(matricula.createdAt).toLocaleString("pt-BR") },
  ];

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-heading text-lg tracking-[0.03em] text-[var(--blue)]">Dados do pré-cadastro</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-[var(--gray)] transition-colors hover:text-[var(--text)]"
          >
            ✕
          </button>
        </div>

        <div>
          {fields.map((f) => (
            <CopyField key={f.label} label={f.label} value={f.value} />
          ))}
        </div>
      </div>
    </div>
  );
}
