import type { Metadata } from "next";
import AvaliacaoForm from "@/components/avaliacao/AvaliacaoForm";

export const metadata: Metadata = {
  title: "Avaliação Física",
  description: "Agende sua avaliação física e bioimpedância na Academia Belfort em Belém.",
};

export default function AvaliacaoFisicaPage() {
  return (
    <div className="theme-avaliacao">
      <AvaliacaoForm />
    </div>
  );
}
