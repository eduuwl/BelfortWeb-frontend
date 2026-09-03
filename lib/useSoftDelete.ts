"use client";

import { useState } from "react";
import type { ActionResult } from "@/lib/adminApi";

const UNDO_WINDOW_MS = 5000;

interface PendingDelete<T> {
  item: T;
  index: number;
  timer: ReturnType<typeof setTimeout>;
}

/**
 * Lista com "apagar com desfazer" estilo Gmail: o item some da tela na hora, mas o DELETE só é
 * disparado de verdade pro backend depois de `UNDO_WINDOW_MS` sem o usuário clicar em "desfazer".
 * Se apertar desfazer antes disso, o item volta pra posição original e nada é enviado ao backend.
 */
export function useSoftDelete<T extends { id: string }>(
  initialItems: T[],
  deleteFn: (id: string) => Promise<ActionResult>,
) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [prevInitialItems, setPrevInitialItems] = useState(initialItems);
  const [pending, setPending] = useState<PendingDelete<T> | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Re-sincroniza `items` quando o pai manda uma lista nova (nova página, nova aba de unidade).
  // Sem isso, `items` só copia `initialItems` na primeira renderização (comportamento padrão do
  // useState) e a tabela continua mostrando o snapshot antigo pra sempre — foi exatamente esse
  // bug que fez a aba Sacramenta mostrar dado de Telégrafo, só "acertando" um clique depois.
  // Ajuste durante a própria renderização (não em useEffect) é o jeito recomendado pelo React
  // pra isso: React descarta essa renderização com o `items` velho e já refaz com o novo antes
  // de pintar a tela, então não existe nem um flash do dado antigo.
  if (initialItems !== prevInitialItems) {
    setPrevInitialItems(initialItems);
    setItems(initialItems);
  }

  function requestDelete(item: T) {
    setError(null);
    const index = items.findIndex((i) => i.id === item.id);
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    const timer = setTimeout(async () => {
      const result = await deleteFn(item.id);
      setPending(null);
      if (!result.ok) {
        setItems((prev) => {
          const next = [...prev];
          next.splice(Math.min(index, next.length), 0, item);
          return next;
        });
        setError(result.message);
      }
    }, UNDO_WINDOW_MS);

    setPending({ item, index, timer });
  }

  function undo() {
    if (!pending) return;
    clearTimeout(pending.timer);
    setItems((prev) => {
      const next = [...prev];
      next.splice(Math.min(pending.index, next.length), 0, pending.item);
      return next;
    });
    setPending(null);
  }

  function dismissError() {
    setError(null);
  }

  return { items, setItems, pending, requestDelete, undo, error, dismissError, undoWindowMs: UNDO_WINDOW_MS };
}
