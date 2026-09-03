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
      <UnidadeFilterTabs unidade={unidade} onChange={setUnidade} />
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && (
        <>
          <AvaliacaoTable key={`${unidade}-${page}`} records={records} />
          <Pagination page={page} total={total} limit={limit} onChange={goToPage} disabled={loading} />
        </>
      )}
    </div>
  );
}
