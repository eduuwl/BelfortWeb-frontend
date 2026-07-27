import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";

export const metadata: Metadata = {
  title: "Página não encontrada",
};

export default function NotFound() {
  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <Nav />

      <section className="flex min-h-screen flex-col items-center justify-center px-8 pb-24 pt-40 text-center">
        <Image
          src="/images/icone-acad.png"
          alt="Academia Belfort"
          width={500}
          height={500}
          className="animate-breathe mb-6 h-16 w-16 opacity-80"
        />

        <div className="font-heading text-[clamp(6rem,20vw,11rem)] leading-none tracking-[0.02em] text-[var(--red)]">
          404
        </div>

        <h1 className="font-heading mb-4 mt-2 text-[clamp(1.6rem,4vw,2.6rem)] leading-tight tracking-[0.02em]">
          Página não encontrada
        </h1>

        <p className="mx-auto mb-10 max-w-[440px] text-[0.95rem] leading-relaxed text-white/60">
          A página que você procura não existe ou foi movida. Que tal voltar pro treino?
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/"
            className="rounded-lg bg-[var(--red)] px-8 py-4 text-[0.9rem] font-bold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:bg-[var(--red-dark)] active:scale-95"
          >
            Voltar para a home
          </Link>
          <Link
            href="/cortesia"
            className="rounded-lg border-[1.5px] border-white/25 px-8 py-4 text-[0.9rem] font-semibold uppercase tracking-[0.06em] text-white transition-all hover:-translate-y-0.5 hover:border-white/60 hover:bg-white/[0.06] active:scale-95"
          >
            Agendar aula grátis
          </Link>
        </div>
      </section>

      <Footer />
      <WhatsFloat />
    </div>
  );
}
