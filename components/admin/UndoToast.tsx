"use client";

import { useEffect } from "react";

export default function UndoToast({
  itemKey,
  message,
  durationMs,
  onUndo,
  onExpire,
}: {
  /** Identificador único do item apagado — usado pra reiniciar o timer/animação a cada nova exclusão. */
  itemKey: string;
  message: string;
  durationMs: number;
  onUndo: () => void;
  onExpire: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onExpire, durationMs);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemKey]);

  return (
    <div className="fixed bottom-6 left-1/2 z-[220] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 overflow-hidden rounded-xl bg-[#0D1F3C] shadow-2xl">
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <span className="text-[0.85rem] text-white">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="shrink-0 text-[0.82rem] font-semibold text-[#ff4444] hover:underline"
        >
          Desfazer
        </button>
      </div>
      <div className="h-[3px] w-full bg-white/15">
        <div
          key={itemKey}
          className="h-full bg-[#ff4444]"
          style={{ animation: `admin-undo-shrink ${durationMs}ms linear forwards` }}
        />
      </div>
    </div>
  );
}
