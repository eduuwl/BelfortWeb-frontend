"use client";

import type { CortesiaRecord } from "@/lib/adminApi";
import { buildGenericContatoMessage, whatsappLinkForCustomer } from "@/lib/whatsappTemplates";

export default function CortesiaTable({ records }: { records: CortesiaRecord[] }) {
  if (records.length === 0) {
    return <p className="text-[0.85rem] text-[var(--gray)]">Nenhuma cortesia agendada ainda.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--gray-light)] bg-white">
      <table className="w-full min-w-[760px] text-left text-[0.85rem]">
        <thead className="bg-[var(--off-white)] text-[0.7rem] uppercase tracking-[0.06em] text-[var(--gray)]">
          <tr>
            <th className="px-4 py-3">Nome</th>
            <th className="px-4 py-3">WhatsApp</th>
            <th className="px-4 py-3">Modalidade</th>
            <th className="px-4 py-3">Dia</th>
            <th className="px-4 py-3">Horário</th>
            <th className="px-4 py-3" />
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-t border-[var(--gray-light)]">
              <td className="px-4 py-3 font-semibold text-[var(--text)]">{r.nome}</td>
              <td className="px-4 py-3">{r.whatsapp}</td>
              <td className="px-4 py-3">{r.modalidade}</td>
              <td className="px-4 py-3">{r.dia}</td>
              <td className="px-4 py-3">{r.horario}</td>
              <td className="px-4 py-3 text-right">
                <a
                  href={whatsappLinkForCustomer(r.whatsapp, buildGenericContatoMessage(r.nome))}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block rounded-lg bg-[#25D366] px-3 py-1.5 text-[0.78rem] font-semibold text-white transition-colors hover:bg-[#1da851]"
                >
                  Entrar em contato
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
