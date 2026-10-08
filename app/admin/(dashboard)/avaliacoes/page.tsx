"use client";

import { useState } from "react";
import { fetchAvaliacoes } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import type { Unidade } from "@/lib/planos";
import AvaliacaoTable from "@/components/admin/AvaliacaoTable";
import Pagination from "@/components/admin/Pagination";
import UnidadeFilterTabs from "@/components/admin/UnidadeFilterTabs";

export default function AvaliacoesPage() {
  const [unidade, setUnidade] = useState<Unidade>("telegrafo");
  const { records, error, page, total, limit, loading, goToPage } = useAdminList(fetchAvaliacoes, unidade);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Avaliações</h1>
      <div className="mb-4 flex items-center gap-3">
        <UnidadeFilterTabs unidade={unidade} onChange={setUnidade} />
        {loading && <span className="text-[0.78rem] text-[var(--gray)]">Atualizando...</span>}
      </div>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && (
        <div className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
          <AvaliacaoTable records={records} />
          <Pagination page={page} total={total} limit={limit} onChange={goToPage} disabled={loading} />
        </div>
      )}
    </div>
  );
}
