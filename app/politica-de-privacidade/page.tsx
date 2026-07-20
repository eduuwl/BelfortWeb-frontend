import type { Metadata } from "next";
import Nav from "@/components/home/Nav";
import Footer from "@/components/home/Footer";
import WhatsFloat from "@/components/home/WhatsFloat";
import Reveal from "@/components/ui/Reveal";
import { UNIDADES } from "@/lib/unidades";

export const metadata: Metadata = {
  title: "Política de Privacidade",
  description: "Como a Academia Belfort coleta, usa e protege os dados pessoais dos seus alunos e visitantes.",
};

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading mb-3 text-[1.4rem] tracking-[0.02em] text-white">{titulo}</h2>
      <div className="space-y-3 text-[0.92rem] leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export default function PoliticaDePrivacidadePage() {
  return (
    <div className="theme-home overflow-x-hidden bg-[var(--blue)] text-white">
      <Nav />

      <section className="px-8 pb-24 pt-40">
        <div className="mx-auto max-w-[760px]">
          <Reveal>
            <div className="mb-3 flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--red)]">
              <span className="block h-0.5 w-5 bg-[var(--red)]" />
              LGPD
            </div>
            <h1 className="font-heading mb-4 text-[clamp(2.2rem,5vw,3.5rem)] leading-[0.95] tracking-[0.02em]">
              Política de Privacidade
            </h1>
            <p className="mb-12 max-w-[600px] text-[0.95rem] leading-relaxed text-white/60">
              Última atualização: julho de 2026. Este documento explica quais dados a Academia Belfort coleta,
              por que coleta e como você pode exercer seus direitos sobre eles.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <Secao titulo="1. Quem somos">
              <p>
                A Academia Belfort opera duas unidades em Belém (PA), responsáveis pelo tratamento dos dados
                pessoais coletados através deste site:
              </p>
              <ul className="list-disc space-y-1 pl-5">
                {UNIDADES.map((u) => (
                  <li key={u.num}>
                    <strong className="text-white">{u.nome}</strong> — {u.logradouro}, {u.bairroNome}, {u.cidade}/
                    {u.estado}
                  </li>
                ))}
              </ul>
            </Secao>

            <Secao titulo="2. Quais dados coletamos">
              <p>
                Coletamos os dados que você mesmo nos fornece ao preencher os formulários de pré-matrícula, aula
                cortesia, avaliação física ou avaliação nutricional: nome completo, data de nascimento, e-mail,
                CPF, endereço, WhatsApp, Instagram (opcional) e, quando aplicável, informações sobre limitação
                física.
              </p>
              <p>
                A informação sobre limitação física é um <strong className="text-white">dado sensível</strong> nos
                termos da LGPD. Ela só é coletada quando você opta por informá-la, e é usada exclusivamente para
                que nossos professores adaptem o treino com segurança.
              </p>
            </Secao>

            <Secao titulo="3. Para que usamos esses dados">
              <ul className="list-disc space-y-1 pl-5">
                <li>Processar sua pré-matrícula e formalizar a matrícula presencialmente;</li>
                <li>Agendar sua aula cortesia, avaliação física ou avaliação nutricional;</li>
                <li>Entrar em contato via WhatsApp para confirmar horários e tirar dúvidas;</li>
                <li>Adaptar o atendimento quando você informa alguma limitação física.</li>
              </ul>
              <p>Não usamos seus dados para fins diferentes destes sem te avisar antes.</p>
            </Secao>

            <Secao titulo="4. Cookies e Google Analytics">
              <p>
                Usamos cookies estritamente necessários para o funcionamento do site (por exemplo, para manter
                sessões de login administrativo). Só usamos cookies analíticos (Google Analytics), que nos ajudam
                a entender como o site é usado, se você autorizar isso explicitamente no banner de cookies.
              </p>
              <p>
                Você pode mudar sua escolha a qualquer momento clicando em{" "}
                <strong className="text-white">&quot;Preferências de cookies&quot;</strong> no rodapé do site.
              </p>
            </Secao>

            <Secao titulo="5. Com quem compartilhamos seus dados">
              <p>
                Seus dados ficam armazenados em uma planilha interna (Google Sheets), acessível apenas pela
                equipe da Academia Belfort. Não vendemos nem compartilhamos seus dados com terceiros para fins de
                marketing.
              </p>
            </Secao>

            <Secao titulo="6. Segurança e retenção">
              <p>
                Adotamos medidas razoáveis para proteger seus dados contra acesso não autorizado. Mantemos os
                dados pelo tempo necessário para as finalidades descritas acima ou até que você solicite a
                exclusão.
              </p>
            </Secao>

            <Secao titulo="7. Seus direitos">
              <p>
                Conforme a LGPD, você pode solicitar a qualquer momento: acesso aos seus dados, correção de
                dados incompletos ou desatualizados, exclusão dos seus dados, e revogação de um consentimento
                dado anteriormente (como o de cookies analíticos).
              </p>
              <p>
                Para exercer qualquer um desses direitos, entre em contato pelo e-mail{" "}
                <a href="mailto:acadbelfort@gmail.com" className="font-semibold text-[var(--red-glow)] hover:underline">
                  acadbelfort@gmail.com
                </a>
                .
              </p>
            </Secao>

            <Secao titulo="8. Alterações desta política">
              <p>
                Podemos atualizar esta política periodicamente. Mudanças relevantes serão publicadas nesta
                mesma página.
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
