"use client";

import { useState } from "react";
import { ClipboardDocumentCheckIcon, ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import type { ActionResult } from "@/lib/adminApi";

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

export default function DetalheModal({
  title,
  fields,
  observacao,
  onSaveObservacao,
  onClose,
  extraField,
}: {
  title: string;
  fields: { label: string; value: string }[];
  observacao: string;
  onSaveObservacao: (value: string) => Promise<ActionResult>;
  onClose: () => void;
  extraField?: {
    label: string;
    value: string;
    placeholder?: string;
    savedMessage?: string;
    onSave: (value: string) => Promise<ActionResult>;
  };
}) {
  const [draft, setDraft] = useState(observacao);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  const [extraDraft, setExtraDraft] = useState(extraField?.value ?? "");
  const [extraSaving, setExtraSaving] = useState(false);
  const [extraFeedback, setExtraFeedback] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSave() {
    setSaving(true);
    setFeedback(null);
    const result = await onSaveObservacao(draft.trim());
    setSaving(false);

    if (!result.ok) {
      setFeedback({ ok: false, message: result.message });
      return;
    }
    setFeedback({ ok: true, message: "Observação salva." });
  }

  async function handleSaveExtra() {
    if (!extraField) return;
    setExtraSaving(true);
    setExtraFeedback(null);
    const result = await extraField.onSave(extraDraft.trim());
    setExtraSaving(false);

    if (!result.ok) {
      setExtraFeedback({ ok: false, message: result.message });
      return;
    }
    setExtraFeedback({ ok: true, message: extraField.savedMessage ?? "Salvo." });
  }

  return (
    <div
      className="fixed inset-0 z-[210] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[85vh] w-full max-w-[480px] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-heading text-lg tracking-[0.03em] text-[var(--blue)]">{title}</h2>
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

        {extraField && (
          <div className="mt-4 border-t border-[var(--gray-light)] pt-4">
            <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--gray)]">
              {extraField.label}
            </label>
            <input
              value={extraDraft}
              onChange={(e) => {
                setExtraDraft(e.target.value);
                setExtraFeedback(null);
              }}
              placeholder={extraField.placeholder}
              className="w-full rounded-[10px] border-[1.5px] border-[var(--gray-light)] bg-white px-3 py-2.5 text-[0.85rem] text-[var(--text)] outline-none transition-all focus:border-[var(--blue-light)]"
            />

            <div className="mt-2 flex items-center justify-between gap-2">
              {extraFeedback && (
                <p className={`text-[0.75rem] ${extraFeedback.ok ? "text-[#166534]" : "text-[var(--red)]"}`}>
                  {extraFeedback.message}
                </p>
              )}
              <button
                type="button"
                onClick={handleSaveExtra}
                disabled={extraSaving || extraDraft === extraField.value}
                className="ml-auto rounded-lg bg-[var(--blue)] px-4 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[var(--blue-mid)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {extraSaving ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </div>
        )}

        <div className="mt-4 border-t border-[var(--gray-light)] pt-4">
          <label className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[var(--gray)]">
            Observação
          </label>
          <textarea
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setFeedback(null);
            }}
            placeholder="Anotações internas sobre esse registro..."
            className="h-24 w-full resize-none rounded-[10px] border-[1.5px] border-[var(--gray-light)] bg-white px-3 py-2.5 text-[0.85rem] text-[var(--text)] outline-none transition-all focus:border-[var(--blue-light)]"
          />

          <div className="mt-2 flex items-center justify-between gap-2">
            {feedback && (
              <p className={`text-[0.75rem] ${feedback.ok ? "text-[#166534]" : "text-[var(--red)]"}`}>
                {feedback.message}
              </p>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || draft === observacao}
              className="ml-auto rounded-lg bg-[var(--blue)] px-4 py-2 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[var(--blue-mid)] disabled:cursor-not-allowed disabled:opacity-45"
            >
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
