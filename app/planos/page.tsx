import type { Metadata } from "next";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";
import Planos from "@/components/home/Planos";

export const metadata: Metadata = {
  title: "Planos",
  description: "Confira todos os planos da Academia Belfort nas unidades Telégrafo e Sacramenta.",
};

export default function PlanosPage() {
  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <Nav />
      <Planos />
      <Footer />
      <WhatsFloat />
    </div>
  );
}
