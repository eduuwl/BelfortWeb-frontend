"use client";

import { useEffect, useRef } from "react";

const MAX_AGE_MS = 24 * 60 * 60 * 1000;

interface Persisted<T> {
  savedAt: number;
  data: T;
}

/**
 * Salva `data` no localStorage a cada mudança e, no primeiro render, restaura o que foi
 * salvo (se não estiver expirado) via `onRestore`. Usado para não perder o progresso do
 * formulário se a pessoa fechar a aba ou atualizar a página no meio do preenchimento.
 *
 * `paused` (ex.: `step === "sucesso"`) impede que o efeito de persistência grave de novo
 * depois de um `clearFormPersistence` — sem isso, a própria mudança de step pro passo de
 * sucesso dispara esse efeito e regrava o storage por cima do que acabou de ser limpo.
 */
export function useFormPersistence<T>(
  key: string,
  data: T,
  onRestore: (data: T) => void,
  options?: { paused?: boolean },
) {
  // A primeira chamada do efeito de persistência (no mount) precisa ser ignorada: ela roda
  // antes do re-render disparado pela restauração abaixo, e gravaria o estado inicial vazio
  // por cima do que acabou de ser lido do localStorage.
  const skipNextPersist = useRef(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Persisted<T>;
      if (Date.now() - parsed.savedAt > MAX_AGE_MS) {
        localStorage.removeItem(key);
        return;
      }
      onRestore(parsed.data);
    } catch {
      localStorage.removeItem(key);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const paused = options?.paused ?? false;

  useEffect(() => {
    if (skipNextPersist.current) {
      skipNextPersist.current = false;
      return;
    }
    if (paused) return;
    try {
      const payload: Persisted<T> = { savedAt: Date.now(), data };
      localStorage.setItem(key, JSON.stringify(payload));
    } catch {
      // localStorage indisponível (modo privado, quota cheia etc.) — segue sem persistir.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, paused]);
}

export function clearFormPersistence(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignora
  }
}
