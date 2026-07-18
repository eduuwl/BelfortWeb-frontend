"use client";

import { useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/solid";
import StepsIndicator from "@/components/form/StepsIndicator";
import FormNav from "@/components/form/FormNav";
import {
  AvisoBox,
  BtnBack,
  BtnPrimary,
  BtnWhatsapp,
  DiaButton,
  FieldInput,
  FieldLabel,
  HorarioButton,
  HorarioGrid,
  LoadingOverlay,
  OptionButton,
  OptionGrid,
  ResumoItem,
  StepDesc,
  StepTitle,
} from "@/components/form/FormControls";
import {
  FormCard,
  FormHero,
  FormPage,
  FormWrap,
  SuccessBox,
  SuccessIcon,
  SuccessMsg,
  SuccessTitle,
} from "@/components/form/FormShell";
import { maskPhone } from "@/lib/validators";
import { DIAS_AVALIACAO, HORARIOS_AVALIACAO_MANHA, HORARIOS_AVALIACAO_TARDE } from "@/lib/horarios";
import { proximaData, formatarDataBr } from "@/lib/dateUtils";
import { submitAvaliacaoNutricional } from "@/lib/api";
import { clearFormPersistence, useFormPersistence } from "@/lib/useFormPersistence";
import { trackEvent } from "@/lib/analytics";
import type { Unidade } from "@/lib/planos";

const STORAGE_KEY = "belfort:avaliacao-nutricional";

type Step = 1 | 2 | 3 | 4 | 5 | "sucesso";

interface FormState {
  nome: string;
  whatsapp: string;
  unidade: Unidade | null;
  dia: string | null;
  horario: string | null;
}

const INITIAL_STATE: FormState = {
  nome: "",
  whatsapp: "",
  unidade: null,
  dia: null,
  horario: null,
};

const WHATSAPP_NUMERO = "5591984862479";

function unidadeLabel(u: Unidade | null): string {
  return u === "telegrafo" ? "Telégrafo" : u === "sacramenta" ? "Sacramenta" : "";
}

export default function AvaliacaoNutricionalForm() {
  const [step, setStep] = useState<Step>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [restaurado, setRestaurado] = useState(false);

  useFormPersistence(
    STORAGE_KEY,
    { form, step },
    (saved) => {
      if (saved.step === "sucesso") {
        clearFormPersistence(STORAGE_KEY);
        return;
      }
      setForm(saved.form);
      setStep(saved.step);
      if (saved.step !== 1) setRestaurado(true);
    },
    { paused: step === "sucesso" },
  );

  useEffect(() => {
    trackEvent("form_start", { form: "avaliacao-nutricional" });
  }, []);

  const stepAnim = direction === 1 ? "animate-step-fwd" : "animate-step-back";

  function goTo(next: Step) {
    setDirection(typeof step === "number" && typeof next === "number" && next < step ? -1 : 1);
    setStep(next);
    trackEvent(next === "sucesso" ? "form_complete" : "form_step", { form: "avaliacao-nutricional", step: next });
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const step1Ok = form.nome.trim().length >= 3 && form.nome.trim().includes(" ") && form.whatsapp.replace(/\D/g, "").length >= 10;
  const step2Ok = form.unidade !== null;
  const step3Ok = form.dia !== null;
  const step4Ok = form.horario !== null;

  const dataAvaliacao = form.dia ? formatarDataBr(proximaData(form.dia)) : "";

  async function handleSubmit() {
    if (!form.unidade || !form.dia || !form.horario) return;
    setLoading(true);
    setSubmitError(null);

    const result = await submitAvaliacaoNutricional({
      nome: form.nome.trim(),
      whatsapp: form.whatsapp.trim(),
      unidade: unidadeLabel(form.unidade),
      dia: form.dia,
      data: dataAvaliacao,
      horario: form.horario,
      valor: "R$ 150,00",
    });

    setLoading(false);

    if (!result.ok) {
      setSubmitError(result.message);
      trackEvent("form_error", { form: "avaliacao-nutricional", message: result.message });
      return;
    }

    clearFormPersistence(STORAGE_KEY);
    goTo("sucesso");
  }

  const whatsMsg = encodeURIComponent(
    `Olá! Acabei de agendar minha avaliação nutricional na Academia Belfort (unidade ${unidadeLabel(
      form.unidade,
    )}) para ${form.dia} dia ${dataAvaliacao} às ${form.horario}. Nome: ${form.nome.trim()}`,
  );

  return (
    <FormPage bgClassName="bg-[var(--blue)]">
      <FormNav />

      <FormHero
        subtitle="Alimentação a favor dos seus objetivos"
        tag="Avaliação Nutricional"
        heroBgClassName="bg-[var(--blue-mid)] pb-20 pt-20"
        tagBgClassName="bg-[var(--red)]"
      />

      <FormWrap>
        <FormCard>
          {restaurado && step !== "sucesso" && (
            <div className="mb-4 rounded-[10px] bg-[#EEF3FC] px-3 py-2 text-center text-[0.75rem] text-[var(--blue)]">
              Continuando de onde você parou.{" "}
              <button
                type="button"
                onClick={() => {
                  clearFormPersistence(STORAGE_KEY);
                  setForm(INITIAL_STATE);
                  setStep(1);
                  setRestaurado(false);
                }}
                className="font-semibold underline underline-offset-2"
              >
                Começar de novo
              </button>
            </div>
          )}
          {step !== "sucesso" && <StepsIndicator total={5} current={step as number} />}

          {step === 1 && (
            <div className={stepAnim}>
              <StepTitle>Seus dados</StepTitle>
              <StepDesc>Vamos agendar sua avaliação nutricional.</StepDesc>

              <FieldInput label="Nome completo" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Ex: João Silva" />
              <FieldInput
                label="WhatsApp (com DDD)"
                value={form.whatsapp}
                onChange={(v) => update("whatsapp", maskPhone(v))}
                placeholder="Ex: 91988776655"
              />

              <AvisoBox>
                <strong>Investimento: R$ 150,00.</strong> O pagamento é feito na recepção ou via Pix no dia da
                avaliação — ainda não temos pagamento online no site.
              </AvisoBox>

              <BtnPrimary disabled={!step1Ok} onClick={() => goTo(2)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 2 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(1)} />
              <StepTitle>Escolha a unidade</StepTitle>
              <StepDesc>Em qual unidade você quer fazer sua avaliação?</StepDesc>

              <OptionGrid>
                <OptionButton icon={MapPinIcon} label="Telégrafo" selected={form.unidade === "telegrafo"} onClick={() => update("unidade", "telegrafo")} />
                <OptionButton icon={MapPinIcon} label="Sacramenta" selected={form.unidade === "sacramenta"} onClick={() => update("unidade", "sacramenta")} />
              </OptionGrid>

              <BtnPrimary disabled={!step2Ok} onClick={() => goTo(3)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 3 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(2)} />
              <StepTitle>Escolha o dia</StepTitle>
              <StepDesc>Atendemos avaliação nutricional de segunda a sexta.</StepDesc>

              <div className="mb-5 grid grid-cols-3 gap-2">
                {DIAS_AVALIACAO.map((d) => (
                  <DiaButton key={d} label={d} selected={form.dia === d} onClick={() => update("dia", d)} />
                ))}
              </div>

              <BtnPrimary disabled={!step3Ok} onClick={() => goTo(4)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 4 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(3)} />
              <StepTitle>Escolha o horário</StepTitle>
              <StepDesc>Horários fixos de manhã e tarde.</StepDesc>

              <FieldLabel>Manhã</FieldLabel>
              <HorarioGrid>
                {HORARIOS_AVALIACAO_MANHA.map((h) => (
                  <HorarioButton key={h.value} label={h.label} selected={form.horario === h.value} onClick={() => update("horario", h.value)} />
                ))}
              </HorarioGrid>

              <FieldLabel>Tarde</FieldLabel>
              <HorarioGrid>
                {HORARIOS_AVALIACAO_TARDE.map((h) => (
                  <HorarioButton key={h.value} label={h.label} selected={form.horario === h.value} onClick={() => update("horario", h.value)} />
                ))}
              </HorarioGrid>

              <BtnPrimary disabled={!step4Ok} onClick={() => goTo(5)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 5 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(4)} />
              <StepTitle>Confirme seu agendamento</StepTitle>
              <StepDesc>Revise os dados antes de finalizar.</StepDesc>

              <div className="mb-6">
                <ResumoItem label="Nome" value={form.nome.trim()} />
                <ResumoItem label="WhatsApp" value={form.whatsapp} />
                <ResumoItem label="Unidade" value={unidadeLabel(form.unidade)} />
                <ResumoItem label="Dia" value={`${form.dia} (${dataAvaliacao})`} />
                <ResumoItem label="Horário" value={form.horario ?? ""} />
                <ResumoItem label="Investimento" value="R$ 150,00" />
              </div>

              {submitError && (
                <p className="mb-4 text-center text-[0.82rem] text-[var(--red)]">{submitError}</p>
              )}

              <BtnPrimary onClick={handleSubmit}>Confirmar agendamento ✓</BtnPrimary>
            </div>
          )}

          {step === "sucesso" && (
            <div className={`${stepAnim} py-4 text-center`}>
              <SuccessIcon />
              <SuccessTitle>Agendado!</SuccessTitle>
              <SuccessMsg>
                Olá {form.nome.trim().split(" ")[0]}! Sua avaliação nutricional foi agendada com sucesso.
              </SuccessMsg>

              <SuccessBox>
                <strong>{unidadeLabel(form.unidade)}</strong>
                <br />
                {form.dia}, {dataAvaliacao} às {form.horario}
                <br />
                Investimento: R$ 150,00 (recepção ou Pix no dia)
              </SuccessBox>

              <div className="mb-6 rounded-xl bg-[#EEF3FC] p-4 text-center text-[0.82rem] leading-relaxed text-[var(--blue)]">
                Nossa equipe entrará em contato pelo WhatsApp para confirmar sua avaliação e enviar as orientações
                de preparo.
              </div>

              <BtnWhatsapp href={`https://wa.me/${WHATSAPP_NUMERO}?text=${whatsMsg}`} />
            </div>
          )}
        </FormCard>
      </FormWrap>

      <LoadingOverlay show={loading} />
    </FormPage>
  );
}
