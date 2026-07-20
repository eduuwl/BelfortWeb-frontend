import type { Metadata } from "next";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";
import Reveal from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Termos de Uso",
  description: "Termos que regem o uso do site da Academia Belfort.",
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading mb-3 text-[1.4rem] tracking-[0.02em] text-white">{titulo}</h2>
      <div className="space-y-3 text-[0.92rem] leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function TermosDeUsoPage() {
  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <Nav />

      <section className="px-8 pb-24 pt-40">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <div className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
              <span className="block h-0.5 w-5 bg-[var(--red)]" />
              Condições de uso
            </div>
            <h1 className="font-heading mb-4 text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.95] tracking-[0.02em]">
              Termos de Uso
            </h1>
            <p className="mb-12 max-w-[600px] text-[0.95rem] leading-relaxed text-white/60">
              Última atualização: julho de 2026. Ao usar este site, você concorda com os termos abaixo.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Secao titulo="1. Aceitação dos termos">
              <p>
                Ao acessar e usar o site da Academia Belfort, você concorda com estes Termos de Uso e com nossa{" "}
                <a href="/politica-de-privacidade" className="font-semibold text-[var(--red-glow)] hover:underline">
                  Política de Privacidade
                </a>
                . Se você não concorda com algum ponto, pedimos que não utilize o site.
              </p>
            </Secao>

            <Secao titulo="2. Finalidade do site">
              <p>
                Este site tem finalidade informativa e de cadastro: apresentar nossas unidades, modalidades e
                planos, e permitir pré-matrícula, agendamento de aula cortesia, avaliação física e avaliação
                nutricional. A matrícula só é formalizada presencialmente, em uma de nossas unidades.
              </p>
            </Secao>

            <Secao titulo="3. Responsabilidade pelas informações enviadas">
              <p>
                Ao preencher qualquer formulário do site, você é responsável pela veracidade e atualização dos
                dados informados. Dados incorretos podem atrasar ou impedir o contato da nossa equipe.
              </p>
            </Secao>

            <Secao titulo="4. Propriedade intelectual">
              <p>
                A marca, o conteúdo textual, as fotos e vídeos publicados neste site pertencem à Academia
                Belfort e não podem ser reproduzidos sem autorização prévia.
              </p>
            </Secao>

            <Secao titulo="5. Planos e valores">
              <p>
                Os planos e valores exibidos no site são informativos e podem ser alterados sem aviso prévio. A
                confirmação final de valores é feita na unidade, no momento da matrícula.
              </p>
            </Secao>

            <Secao titulo="6. Aula cortesia e avaliações">
              <p>
                O agendamento de aula cortesia, avaliação física ou avaliação nutricional pelo site é uma
                reserva de horário, sujeita à confirmação da nossa equipe via WhatsApp.
              </p>
            </Secao>

            <Secao titulo="7. Limitação de responsabilidade">
              <p>
                Fazemos o possível para manter as informações deste site atualizadas e corretas, mas não nos
                responsabilizamos por eventuais indisponibilidades temporárias ou imprecisões pontuais.
              </p>
            </Secao>

            <Secao titulo="8. Alterações destes termos">
              <p>
                Podemos atualizar estes termos periodicamente. A versão vigente é sempre a publicada nesta
                página.
              </p>
            </Secao>

            <Secao titulo="9. Foro e legislação aplicável">
              <p>
                Estes termos são regidos pela legislação brasileira, com foro eleito na comarca de Belém, PA,
                para dirimir eventuais controvérsias.
              </p>
            </Secao>

            <Secao titulo="10. Contato">
              <p>
                Dúvidas sobre estes termos podem ser enviadas para{" "}
                <a href="mailto:acadbelfort@gmail.com" className="font-semibold text-[var(--red-glow)] hover:underline">
                  acadbelfort@gmail.com
                </a>
                .
              </p>
            </Secao>
          </Reveal>
        </div>
      </section>

      <Footer />
      <WhatsFloat />
    </div>
  );
}
