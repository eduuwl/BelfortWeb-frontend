import type { Metadata } from "next";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";
import Reveal from "@/components/ui/Reveal";
import { UNIDADES } from "@/lib/unidades";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const DESCRIPTION =
  "Conheça a Academia Belfort: nosso propósito, nossa equipe e o compromisso com a saúde, qualidade de vida e evolução de cada aluno em Belém.";

export const metadata: Metadata = {
  title: "Sobre Nós",
  description: DESCRIPTION,
};

function jsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Sobre a Academia Belfort",
    url: `${SITE_URL}/sobre`,
    description: DESCRIPTION,
    mainEntity: {
      "@type": "ExerciseGym",
      name: "Academia Belfort",
      url: SITE_URL,
      image: `${SITE_URL}/images/logo.png`,
      taxID: "18.353.376/0002-26",
      location: UNIDADES.map((u) => ({
        "@type": "Place",
        name: u.nome,
        telephone: u.telefone,
        address: {
          "@type": "PostalAddress",
          streetAddress: `${u.logradouro} - ${u.bairroNome}`,
          addressLocality: u.cidade,
          addressRegion: u.estado,
          addressCountry: "BR",
        },
      })),
    },
  };
}

export default function SobrePage() {
  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()) }}
      />
      <Nav />

      <section className="px-8 pb-24 pt-40">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <div className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
              <span className="block h-0.5 w-5 bg-[var(--red)]" />
              Quem somos
            </div>
            <h1 className="font-heading mb-10 text-[clamp(2.5rem,6vw,4.5rem)] leading-[0.95] tracking-[0.02em]">
              Sobre nós
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <div className="space-y-6 text-[0.95rem] leading-relaxed text-white/70">
              <p>
                Na Academia Belfort, acreditamos que treinar vai muito além da estética. Nosso propósito é
                proporcionar saúde, qualidade de vida e bem-estar por meio de um ambiente acolhedor, motivador e
                preparado para atender pessoas de todos os níveis de condicionamento físico.
              </p>
              <p>
                Contamos com uma equipe de profissionais qualificados e comprometidos em oferecer um
                acompanhamento próximo, auxiliando cada aluno a conquistar seus objetivos com segurança,
                eficiência e respeito às suas individualidades. Seja para emagrecimento, ganho de massa
                muscular, melhora do condicionamento físico, reabilitação ou qualidade de vida, aqui você
                encontra o suporte necessário para evoluir.
              </p>
              <p>
                Além da musculação, a Belfort oferece diversas modalidades que tornam a rotina de treinos mais
                dinâmica e completa, proporcionando opções para todas as idades e perfis.
              </p>
              <p>
                Nosso compromisso é manter uma estrutura organizada, equipamentos de qualidade e um atendimento
                humanizado, criando um ambiente onde cada aluno se sinta motivado a superar seus próprios
                limites.
              </p>
              <p>
                Mais do que uma academia, a Belfort é uma comunidade formada por pessoas que compartilham o
                mesmo objetivo: evoluir um pouco a cada dia.
              </p>
              <p className="font-heading text-[1.4rem] tracking-[0.02em] text-white">
                Belfort Academia. Sua evolução começa aqui.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsFloat />
    </div>
  );
}
