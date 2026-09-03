"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { ListFetchResult } from "./adminApi";

interface AdminListState<T> {
  records: T[] | null;
  error: string | null;
  page: number;
  total: number;
  limit: number;
}

const INITIAL_STATE = { records: null, error: null, page: 1, total: 0, limit: 1 };

/**
 * Estado padrão das telas de listagem do admin (matrículas, cortesias, avaliações, banners):
 * busca a página 1 no mount (e de novo sempre que `filter` mudar — ex.: trocar a aba de unidade),
 * expõe `goToPage` pra navegação Anterior/Próxima, e redireciona pro login em qualquer 401. Sem
 * isso, cada tela reimplementava a mesma busca+paginação na mão — e o bug que motivou essa
 * extração (cadastros "sumindo" do painel) era exatamente essa lógica faltando em todas as 5
 * telas ao mesmo tempo.
 *
 * O fetch do mount/troca-de-filtro fica inline dentro do useEffect (não delegado a uma função
 * nomeada chamada de dentro do efeito) de propósito — chamar uma função por referência dentro do
 * useEffect cujo corpo dá setState aciona o lint react-hooks/set-state-in-effect.
 */
export function useAdminList<T, F = undefined>(
  fetchPage: (page: number, limit: number | undefined, filter: F) => Promise<ListFetchResult<T>>,
  filter: F = undefined as F,
) {
  const router = useRouter();
  const [state, setState] = useState<AdminListState<T>>(INITIAL_STATE as AdminListState<T>);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    fetchPage(1, undefined, filter).then((result) => {
      if (!active) return;
      if (!result.ok) {
        if (result.status === 401) {
          router.push("/admin/login");
          return;
        }
        setState((s) => ({ ...s, error: result.message }));
        return;
      }
      setState({
        records: result.result.data,
        error: null,
        page: result.result.page,
        total: result.result.total,
        limit: result.result.limit,
      });
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  async function goToPage(page: number) {
    setLoading(true);
    const result = await fetchPage(page, undefined, filter);
    setLoading(false);

    if (!result.ok) {
      if (result.status === 401) {
        router.push("/admin/login");
        return;
      }
      setState((s) => ({ ...s, error: result.message }));
      return;
    }

    setState({
      records: result.result.data,
      error: null,
      page: result.result.page,
      total: result.result.total,
      limit: result.result.limit,
    });
  }

  /** Vai pra última página (usada depois de criar um registro novo — ele entra no final da lista). */
  function goToLastPage() {
    const lastPage = Math.max(1, Math.ceil((state.total + 1) / state.limit));
    return goToPage(lastPage);
  }

  return { ...state, loading, goToPage, goToLastPage };
}
