"use client";

import { useState } from "react";
import { fetchMatriculas } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import type { Unidade } from "@/lib/planos";
import MatriculaTable from "@/components/admin/MatriculaTable";
import Pagination from "@/components/admin/Pagination";
import UnidadeFilterTabs from "@/components/admin/UnidadeFilterTabs";

export default function MatriculasPage() {
  const [unidade, setUnidade] = useState<Unidade>("telegrafo");
  const { records, error, page, total, limit, loading, goToPage } = useAdminList(fetchMatriculas, unidade);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Pré-cadastros</h1>
      <div className="mb-4 flex items-center gap-3">
        <UnidadeFilterTabs unidade={unidade} onChange={setUnidade} />
        {loading && <span className="text-[0.78rem] text-[var(--gray)]">Atualizando...</span>}
      </div>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && (
        <div className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
          <MatriculaTable records={records} />
          <Pagination page={page} total={total} limit={limit} onChange={goToPage} disabled={loading} />
        </div>
      )}
    </div>
  );
}
