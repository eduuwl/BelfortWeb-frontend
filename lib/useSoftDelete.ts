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
  const [pending, setPending] = useState<PendingDelete<T> | null>(null);
  const [error, setError] = useState<string | null>(null);

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
