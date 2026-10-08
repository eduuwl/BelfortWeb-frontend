"use client";

import { useState } from "react";
import { fetchCortesias } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import type { Unidade } from "@/lib/planos";
import CortesiaTable from "@/components/admin/CortesiaTable";
import CortesiaQuickCreateForm from "@/components/admin/CortesiaQuickCreateForm";
import Pagination from "@/components/admin/Pagination";
import UnidadeFilterTabs from "@/components/admin/UnidadeFilterTabs";

export default function CortesiasPage() {
  const [unidade, setUnidade] = useState<Unidade>("telegrafo");
  const { records, error, page, total, limit, loading, goToPage, goToLastPage } = useAdminList(
    fetchCortesias,
    unidade,
  );

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Cortesias</h1>
      <CortesiaQuickCreateForm
        onCreated={(unidadeCriada) => {
          // Se a cortesia criada é de uma unidade diferente da aba aberta, troca de aba — senão
          // "ir pra última página" ficaria pulando na lista errada.
          if (unidadeCriada !== unidade) {
            setUnidade(unidadeCriada);
          } else {
            goToLastPage();
          }
        }}
      />
      <div className="mb-4 flex items-center gap-3">
        <UnidadeFilterTabs unidade={unidade} onChange={setUnidade} />
        {loading && <span className="text-[0.78rem] text-[var(--gray)]">Atualizando...</span>}
      </div>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && (
        <div className={loading ? "opacity-50 transition-opacity" : "transition-opacity"}>
          <CortesiaTable records={records} />
          <Pagination page={page} total={total} limit={limit} onChange={goToPage} disabled={loading} />
        </div>
      )}
    </div>
  );
}
