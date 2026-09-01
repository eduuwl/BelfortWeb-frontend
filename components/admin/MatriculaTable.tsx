"use client";

import { useState } from "react";
import { deleteMatricula, salvarNumeroMatricula, salvarObservacao, type MatriculaRecord } from "@/lib/adminApi";
import { buildMatriculaConfirmMessage, whatsappLinkForCustomer } from "@/lib/whatsappTemplates";
import { useSoftDelete } from "@/lib/useSoftDelete";
import MatriculaNumeroModal from "./MatriculaNumeroModal";
import DetalheModal from "./DetalheModal";
import ConfirmDialog from "./ConfirmDialog";
import UndoToast from "./UndoToast";
import DeleteButton from "./DeleteButton";

export default function MatriculaTable({ records }: { records: MatriculaRecord[] }) {
  const [contatoAlvo, setContatoAlvo] = useState<MatriculaRecord | null>(null);
  const [confirmAlvo, setConfirmAlvo] = useState<MatriculaRecord | null>(null);
  const [detalheAlvo, setDetalheAlvo] = useState<MatriculaRecord | null>(null);
  const { items, setItems, pending, requestDelete, undo, undoWindowMs, error, dismissError } = useSoftDelete(
    records,
    deleteMatricula,
  );

  if (items.length === 0) {
    return <p className="text-[0.85rem] text-[var(--gray)]">Nenhum pré-cadastro ainda.</p>;
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-[var(--gray-light)] bg-white">
        <table className="w-full min-w-[820px] text-left text-[0.85rem]">
          <thead className="bg-[var(--off-white)] text-[0.7rem] uppercase tracking-[0.06em] text-[var(--gray)]">
            <tr>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">WhatsApp</th>
              <th className="px-4 py-3">Modalidade</th>
              <th className="px-4 py-3">Unidade</th>
              <th className="px-4 py-3">Plano</th>
              <th className="px-4 py-3">Matrícula</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {items.map((r) => (
              <tr
                key={r.id}
                onClick={() => setDetalheAlvo(r)}
                className="cursor-pointer border-t border-[var(--gray-light)] transition-colors hover:bg-[var(--off-white)]"
              >
                <td className="px-4 py-3 font-semibold text-[var(--text)]">{r.nome}</td>
                <td className="px-4 py-3">{r.whatsapp}</td>
                <td className="px-4 py-3">{r.modalidade}</td>
                <td className="px-4 py-3">{r.unidade}</td>
                <td className="px-4 py-3">{r.plano}</td>
                <td className="px-4 py-3">
                  {r.numeroMatricula ? (
                    <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2.5 py-1 text-[0.72rem] font-semibold text-[#166534]">
                      Nº {r.numeroMatricula}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-[var(--off-white)] px-2.5 py-1 text-[0.72rem] font-semibold text-[var(--gray)]">
                      Pendente
                    </span>
                  )}
                </td>
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setContatoAlvo(r)}
                      className="rounded-lg bg-[#25D366] px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#1da851]"
                    >
                      Entrar em contato
                    </button>
                    <DeleteButton onClick={() => setConfirmAlvo(r)} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {contatoAlvo && (
        <MatriculaNumeroModal
          nome={contatoAlvo.nome}
          onClose={() => setContatoAlvo(null)}
          onConfirm={(numero) => {
            const link = whatsappLinkForCustomer(
              contatoAlvo.whatsapp,
              buildMatriculaConfirmMessage({ nome: contatoAlvo.nome, numero }),
            );
            window.open(link, "_blank");
            setContatoAlvo(null);
          }}
        />
      )}

      {detalheAlvo && (
        <DetalheModal
          title="Dados do pré-cadastro"
          fields={[
            { label: "Nome", value: detalheAlvo.nome },
            { label: "Data de nascimento", value: detalheAlvo.nascimento },
            { label: "E-mail", value: detalheAlvo.email },
            { label: "CPF", value: detalheAlvo.cpf },
            { label: "Endereço", value: detalheAlvo.endereco },
            { label: "WhatsApp", value: detalheAlvo.whatsapp },
            { label: "Instagram", value: detalheAlvo.instagram },
            { label: "Limitação física", value: detalheAlvo.limitacao },
            { label: "Modalidade", value: detalheAlvo.modalidade },
            { label: "Unidade", value: detalheAlvo.unidade },
            { label: "Horário", value: detalheAlvo.horario },
            { label: "CREF (personal externo)", value: detalheAlvo.cref },
            { label: "Plano", value: detalheAlvo.plano },
            { label: "Aceite do termo", value: detalheAlvo.aceite },
            { label: "Cadastrado em", value: new Date(detalheAlvo.createdAt).toLocaleString("pt-BR") },
          ]}
          observacao={detalheAlvo.observacao}
          onSaveObservacao={async (valor) => {
            const result = await salvarObservacao("matricula", detalheAlvo.id, valor);
            if (result.ok) {
              setItems((prev) => prev.map((item) => (item.id === detalheAlvo.id ? { ...item, observacao: valor } : item)));
              setDetalheAlvo((prev) => (prev ? { ...prev, observacao: valor } : prev));
            }
            return result;
          }}
          extraField={{
            label: "Número da matrícula",
            value: detalheAlvo.numeroMatricula,
            placeholder: "Ex: 0451",
            savedMessage: "Matrícula confirmada.",
            onSave: async (valor) => {
              const result = await salvarNumeroMatricula(detalheAlvo.id, valor);
              if (result.ok) {
                setItems((prev) =>
                  prev.map((item) => (item.id === detalheAlvo.id ? { ...item, numeroMatricula: valor } : item)),
                );
                setDetalheAlvo((prev) => (prev ? { ...prev, numeroMatricula: valor } : prev));
              }
              return result;
            },
          }}
          onClose={() => setDetalheAlvo(null)}
        />
      )}

      {confirmAlvo && (
        <ConfirmDialog
          title="Apagar registro?"
          message={`Tem certeza que deseja apagar o pré-cadastro de ${confirmAlvo.nome}?`}
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
