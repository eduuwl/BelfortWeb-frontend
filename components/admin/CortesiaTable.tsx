"use client";

import { useState } from "react";
import { confirmarPresencaCortesia, deleteCortesia, type CortesiaRecord } from "@/lib/adminApi";
import { buildGenericContatoMessage, whatsappLinkForCustomer } from "@/lib/whatsappTemplates";
import { useSoftDelete } from "@/lib/useSoftDelete";
import ConfirmDialog from "./ConfirmDialog";
import UndoToast from "./UndoToast";
import DeleteButton from "./DeleteButton";

export default function CortesiaTable({ records }: { records: CortesiaRecord[] }) {
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<{ id: string; message: string } | null>(null);
  const [confirmAlvo, setConfirmAlvo] = useState<CortesiaRecord | null>(null);
  const { items, setItems, pending, requestDelete, undo, undoWindowMs, error, dismissError } = useSoftDelete(
    records,
    deleteCortesia,
  );

  if (items.length === 0) {
    return <p className="text-[0.85rem] text-[var(--gray)]">Nenhuma cortesia agendada ainda.</p>;
  }

  async function togglePresenca(r: CortesiaRecord) {
    setUpdatingId(r.id);
    setErrorId(null);
    const result = await confirmarPresencaCortesia(r.id, !r.presencaConfirmada);
    setUpdatingId(null);

    if (!result.ok) {
      setErrorId({ id: r.id, message: result.message });
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === r.id ? { ...item, presencaConfirmada: !item.presencaConfirmada } : item)),
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[var(--gray-light)] bg-white">
        <table className="w-full min-w-[920px] text-left text-[0.85rem]">
          <thead className="bg-[var(--off-white)] text-[0.7rem] uppercase tracking-[0.06em] text-[var(--gray)]">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Modalidade</th>
              <th className="px-4 py-3">Dia</th>
              <th className="px-4 py-3">Horário</th>
              <th className="px-4 py-3">Presença</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr key={r.id} className="border-t border-[var(--gray-light)]">
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{r.nome}</td>
                <td className="px-4 py-3">{r.whatsapp}</td>
                <td className="px-4 py-3">{r.modalidade}</td>
                <td className="px-4 py-3">
                  {r.dia} ({r.datasAula})
                </td>
                <td className="px-4 py-3">{r.horario}</td>
                <td className="px-4 py-3">
                  {r.presencaConfirmada ? (
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#F0FDF4] px-2.5 py-1 text-[0.72rem] font-semibold text-[#166534]">
                        ✓ Confirmada
                      </span>
                      <button
                        type="button"
                        disabled={updatingId === r.id}
                        onClick={() => togglePresenca(r)}
                        className="text-[0.72rem] text-[var(--gray)] underline-offset-2 hover:text-[var(--red)] hover:underline disabled:opacity-45"
                      >
                        desfazer
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={updatingId === r.id}
                      onClick={() => togglePresenca(r)}
                      className="rounded-lg border-[1.5px] border-[var(--blue)] px-3 py-1.5 text-[0.78rem] font-semibold text-[var(--blue)] transition-colors hover:bg-[var(--blue)] hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                    >
                      {updatingId === r.id ? "Confirmando..." : "Confirmar presença"}
                    </button>
                  )}
                  {errorId?.id === r.id && (
                    <p className="mt-1 text-[0.72rem] text-[var(--red)]">{errorId.message}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={whatsappLinkForCustomer(r.whatsapp, buildGenericContatoMessage(r.nome))}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block rounded-lg bg-[#25D366] px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#1da851]"
                    >
                      Entrar em contato
                    </a>
                    <DeleteButton onClick={() => setConfirmAlvo(r)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmAlvo && (
        <ConfirmDialog
          title="Apagar registro?"
          message={`Tem certeza que deseja apagar a cortesia de ${confirmAlvo.nome}?`}
          onCancel={() => setConfirmAlvo(null)}
          onConfirm={() => {
            requestDelete(confirmAlvo);
            setConfirmAlvo(null);
          }}
        />
      )}

      {pending && (
        <UndoToast
          itemKey={pending.item.id}
          message={`Registro de ${pending.item.nome} apagado`}
          durationMs={undoWindowMs}
          onUndo={undo}
          onExpire={() => {}}
        />
      )}

      {error && (
        <div className="fixed bottom-24 left-1/2 z-[220] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 rounded-xl bg-[var(--red-dark)] px-4 py-3 text-center text-[0.82rem] text-white shadow-2xl">
          {error}
          <button type="button" onClick={dismissError} className="ml-2 underline">
            ok
          </button>
        </div>
      )}
    </>
  );
}
