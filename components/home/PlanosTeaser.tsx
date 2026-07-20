"use client";

import { useState } from "react";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { PLANOS_TEASER_SACRAMENTA, PLANOS_TEASER_TELEGRAFO } from "@/lib/planosCards";
import { Card } from "./Planos";

export default function PlanosTeaser() {
  const [unidade, setUnidade] = useState<"telegrafo" | "sacramenta">("telegrafo");
  const planos = unidade === "telegrafo" ? PLANOS_TEASER_TELEGRAFO : PLANOS_TEASER_SACRAMENTA;

  return (
    <section id="planos" className="bg-[var(--blue)] px-8 py-24 text-white">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <div className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
            <span className="block h-0.5 w-5 bg-[var(--red)]" />
            Investimento
          </div>
          <h2 className="font-heading mb-10 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[0.02em] text-white">
            Escolha seu
            <br />
            plano
          </h2>

          <div className="mb-10 flex gap-2">
            {(["telegrafo", "sacramenta"] as const).map((u) => (
              <button
                key={u}
                onClick={() => setUnidade(u)}
                className={`rounded-lg border-[1.5px] px-6 py-[0.6rem] text-[0.85rem] font-semibold uppercase tracking-[0.06em] transition-all active:scale-95 ${
                  unidade === u
                    ? "border-white bg-white text-[var(--blue)]"
                    : "border-white/25 bg-transparent text-white/60 hover:border-white hover:text-white"
                }`}
              >
                {u === "telegrafo" ? "Telégrafo" : "Sacramenta"}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {planos.map((p, i) => (
            <Reveal key={p.nome} delay={i * 80}>
              <Card plano={p} />
            </Reveal>
          ))}
        </div>

        <Reveal delay={planos.length * 80}>
          <div className="mt-10 flex justify-center">
            <Link
              href="/planos"
              className="inline-flex items-center gap-2 rounded-lg border-[1.5px] border-white/25 px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/[0.06] active:scale-95"
            >
              Ver todos os planos →
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
