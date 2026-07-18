import type { Metadata } from "next";
import AvaliacaoNutricionalForm from "@/components/avaliacaoNutricional/AvaliacaoNutricionalForm";

export const metadata: Metadata = {
  title: "Avaliação Nutricional",
  description: "Agende sua avaliação nutricional na Academia Belfort em Belém.",
};

export default function AvaliacaoNutricionalPage() {
  return (
    <div className="theme-avaliacao">
      <AvaliacaoNutricionalForm />
    </div>
  );
}
