"use client";

import { useEffect, useState } from "react";
import { BoltIcon, ExclamationTriangleIcon, FaceSmileIcon, FireIcon, MapPinIcon } from "@heroicons/react/24/solid";
import StepsIndicator from "@/components/form/StepsIndicator";
import FormNav from "@/components/form/FormNav";
import {
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
  ToggleRow,
} from "@/components/form/FormControls";
import {
  FormCard,
  FormHero,
  FormPage,
  FormWrap,
  SuccessIcon,
  SuccessMsg,
  SuccessTitle,
} from "@/components/form/FormShell";
import { cpfValido, isValidEmail, maskCPF, maskPhone } from "@/lib/validators";
import {
  deriveCortesiaAgendamento,
  diaEstaDesabilitado,
  diasOpcoesParaModalidade,
  horarioValidoNoSabado,
  modalidadeLabel,
  unidadeLabel,
} from "@/lib/cortesiaLogic";
import { submitCortesia } from "@/lib/api";
import { clearFormPersistence, useFormPersistence } from "@/lib/useFormPersistence";
import { trackEvent } from "@/lib/analytics";
import type { Modalidade, Unidade } from "@/lib/planos";

const STORAGE_KEY = "belfort:cortesia";

type Step = 1 | 2 | 3 | 4 | 5 | "sucesso";

interface FormState {
  modalidade: Modalidade | null;
  unidade: Unidade | null;
  nome: string;
  whatsapp: string;
  email: string;
  cpf: string;
  limitacao: boolean | null;
  limitacaoDesc: string;
  horario: string | null;
  dia: string | null;
}

const INITIAL_STATE: FormState = {
  modalidade: null,
  unidade: null,
  nome: "",
  whatsapp: "",
  email: "",
  cpf: "",
  limitacao: null,
  limitacaoDesc: "",
  horario: null,
  dia: null,
};

const WHATSAPP_NUMERO = "5591984862479";

export default function CortesiaForm() {
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
    trackEvent("form_start", { form: "cortesia" });
  }, []);

  const stepAnim = direction === 1 ? "animate-step-fwd" : "animate-step-back";

  function goTo(next: Step) {
    setDirection(typeof step === "number" && typeof next === "number" && next < step ? -1 : 1);
    setStep(next);
    trackEvent(next === "sucesso" ? "form_complete" : "form_step", { form: "cortesia", step: next });
  }

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const step1Ok = form.modalidade !== null && (form.modalidade !== "musculacao" || form.unidade !== null);

  const step2Ok =
    form.nome.trim().length >= 3 &&
    form.nome.trim().includes(" ") &&
    form.whatsapp.replace(/\D/g, "").length >= 10 &&
    isValidEmail(form.email.trim()) &&
    cpfValido(form.cpf) &&
    form.limitacao !== null;

  const step3Ok = form.horario !== null;
  const step4Ok = form.dia !== null;

  const { horarios, crossSomenteSabado, diasStr, horarioLabel, datasAula, diasComDatas } =
    deriveCortesiaAgendamento(form.modalidade, form.horario, form.dia);

  const diasOpcoes = diasOpcoesParaModalidade(form.modalidade, crossSomenteSabado, form.horario);

  function selectDia(d: string) {
    update("dia", d);
  }

  function selectModalidade(m: Modalidade) {
    setForm((f) => ({
      ...f,
      modalidade: m,
      // Cross Training e Funcional Kids só existem na unidade Telégrafo — a musculação é a
      // única modalidade em que a pessoa realmente escolhe a unidade.
      unidade: m === "musculacao" ? f.unidade : "telegrafo",
      horario: null,
      dia: null,
    }));
  }

  function selectUnidade(u: Unidade) {
    update("unidade", u);
  }

  function selectHorario(v: string) {
    setForm((f) => ({ ...f, horario: v, dia: null }));
  }

  async function handleSubmit() {
    if (!form.modalidade || !form.horario || !form.dia) return;
    setLoading(true);
    setSubmitError(null);

    const result = await submitCortesia({
      nome: form.nome.trim(),
      whatsapp: form.whatsapp.trim(),
      email: form.email.trim(),
      cpf: form.cpf.trim(),
      modalidade: modalidadeLabel(form.modalidade),
      unidade: unidadeLabel(form.unidade),
      horario: horarioLabel,
      dia: diasStr,
      datasAula,
      limitacao: form.limitacao ? form.limitacaoDesc.trim() || "Sim" : "Não",
    });

    setLoading(false);

    if (!result.ok) {
      setSubmitError(result.message);
      trackEvent("form_error", { form: "cortesia", message: result.message });
      return;
    }

    clearFormPersistence(STORAGE_KEY);
    goTo("sucesso");
  }

  const whatsMsg = encodeURIComponent(
    `Olá! Acabei de agendar minha aula de cortesia de ${modalidadeLabel(
      form.modalidade,
    )} na Academia Belfort (unidade ${unidadeLabel(form.unidade)}) para ${diasComDatas} às ${horarioLabel}. Nome: ${form.nome.trim()}`,
  );

  return (
    <FormPage bgClassName="bg-[var(--blue)]">
      <FormNav />

      <FormHero
        subtitle="Sua jornada começa aqui"
        tag="Aula de Cortesia Gratuita"
        heroBgClassName="bg-[var(--red-dark)] pb-20 pt-20"
        tagBgClassName="bg-[var(--blue)]"
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
              <StepTitle>Escolha a modalidade</StepTitle>
              <StepDesc>Qual aula de cortesia você quer experimentar?</StepDesc>

              <OptionGrid>
                <OptionButton icon={FireIcon} label="Musculação" selected={form.modalidade === "musculacao"} onClick={() => selectModalidade("musculacao")} />
                <OptionButton icon={BoltIcon} label="Cross Training" selected={form.modalidade === "cross"} onClick={() => selectModalidade("cross")} />
                <OptionButton icon={FaceSmileIcon} label="Funcional Kids" selected={form.modalidade === "kids"} onClick={() => selectModalidade("kids")} />
              </OptionGrid>

              {form.modalidade === "musculacao" && (
                <>
                  <FieldLabel>Unidade</FieldLabel>
                  <OptionGrid>
                    <OptionButton icon={MapPinIcon} label="Telégrafo" selected={form.unidade === "telegrafo"} onClick={() => selectUnidade("telegrafo")} />
                    <OptionButton icon={MapPinIcon} label="Sacramenta" selected={form.unidade === "sacramenta"} onClick={() => selectUnidade("sacramenta")} />
                  </OptionGrid>
                </>
              )}

              <BtnPrimary disabled={!step1Ok} onClick={() => goTo(2)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 2 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(1)} />
              <StepTitle>Seus dados</StepTitle>
              <StepDesc>Precisamos de algumas informações para confirmar seu agendamento.</StepDesc>

              <FieldInput label="Nome completo" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Ex: João Silva" />
              <FieldInput label="WhatsApp (com DDD)" value={form.whatsapp} onChange={(v) => update("whatsapp", maskPhone(v))} placeholder="Ex: 91988776655" />
              <FieldInput
                label="E-mail"
                type="email"
                value={form.email}
                onChange={(v) => update("email", v)}
                placeholder="seu@email.com"
                hint={<span className="font-normal normal-case text-[var(--gray)]">(pra te lembrar da aula)</span>}
              />
              <FieldInput label="CPF" value={form.cpf} onChange={(v) => update("cpf", maskCPF(v))} placeholder="000.000.000-00" maxLength={14} />

              <div className="mb-1">
                <label className="mb-1.5 block text-[0.8rem] font-semibold uppercase tracking-[0.04em] text-[var(--blue)]">
                  Possui alguma limitação física?
                </label>
                <ToggleRow value={form.limitacao} onChange={(v) => update("limitacao", v)} />
                {form.limitacao && (
                  <textarea
                    value={form.limitacaoDesc}
                    onChange={(e) => update("limitacaoDesc", e.target.value)}
                    placeholder="Descreva brevemente sua limitação..."
                    className="h-20 w-full resize-none rounded-[10px] border-[1.5px] border-[var(--gray-light)] bg-white px-4 py-3 text-[0.95rem] text-[var(--text)] outline-none transition-all focus:border-[var(--blue-light)]"
                  />
                )}
              </div>

              <div className="mt-4">
                <BtnPrimary disabled={!step2Ok} onClick={() => goTo(3)}>
                  Continuar
                </BtnPrimary>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(2)} />
              <StepTitle>Escolha o horário</StepTitle>
              <StepDesc>
                {form.modalidade === "musculacao"
                  ? "Horário livre — Seg a Sex: 6h às 22h · Sáb: 8h às 16h."
                  : form.modalidade === "kids"
                    ? "Turma única de Funcional Kids, na unidade Telégrafo."
                    : "Horários fixos das aulas de Cross Training."}
              </StepDesc>

              <HorarioGrid>
                {horarios.map((h) => (
                  <HorarioButton
                    key={h.value}
                    label={h.label}
                    selected={form.horario === h.value}
                    onClick={() => selectHorario(h.value)}
                  />
                ))}
              </HorarioGrid>

              <BtnPrimary disabled={!step3Ok} onClick={() => goTo(4)}>
                Continuar
              </BtnPrimary>
            </div>
          )}

          {step === 4 && (
            <div className={stepAnim}>
              <BtnBack onClick={() => goTo(3)} />
              <StepTitle>Escolha o dia</StepTitle>
              <StepDesc>
                {crossSomenteSabado
                  ? "Esse horário de Cross Training acontece apenas aos sábados."
                  : form.modalidade === "cross"
                    ? "Escolha o primeiro dia — suas 3 aulas consecutivas serão definidas automaticamente."
                    : form.modalidade === "kids"
                      ? "A turma acontece segunda, quarta e sexta — escolha o dia da sua aula experimental."
                      : form.modalidade === "musculacao" && !horarioValidoNoSabado(form.horario)
                        ? "Escolha o melhor dia para sua aula experimental (aos sábados funcionamos só das 8h às 16h)."
                        : "Escolha o melhor dia para sua aula experimental."}
              </StepDesc>

              <div className="mb-5 grid grid-cols-3 gap-2">
                {diasOpcoes.map((d) => (
                  <DiaButton
                    key={d.label}
                    label={d.label}
                    sub={d.sub}
                    selected={form.dia === d.label}
                    onClick={() => selectDia(d.label)}
                    disabled={diaEstaDesabilitado(d.label, form.horario)}
                  />
                ))}
              </div>

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
                <ResumoItem label="Modalidade" value={modalidadeLabel(form.modalidade)} />
                <ResumoItem label="Unidade" value={unidadeLabel(form.unidade)} />
                <ResumoItem label="Nome" value={form.nome.trim()} />
                <ResumoItem label="WhatsApp" value={form.whatsapp} />
                <ResumoItem label="E-mail" value={form.email.trim()} />
                <ResumoItem label="CPF" value={form.cpf} />
                <ResumoItem label="Horário" value={horarioLabel} />
                <ResumoItem label="Dia(s)" value={diasComDatas} />
                {form.limitacao && (
                  <ResumoItem label="Limitação" value={<span className="text-[var(--red)]">{form.limitacaoDesc || "Sim"}</span>} />
                )}
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
                Olá {form.nome.trim().split(" ")[0]}! Sua aula de {modalidadeLabel(form.modalidade)} foi agendada com
                sucesso.
              </SuccessMsg>

              <div className="mb-6 rounded-xl bg-[var(--off-white)] p-5 text-left">
                {form.modalidade === "cross" ? (
                  <>
                    <p className="mb-1 text-[0.82rem] text-[var(--gray)]">
                      {crossSomenteSabado ? "Seu dia de treino:" : "Seus 3 dias de treino:"}
                    </p>
                    <strong className="text-[0.95rem] text-[var(--blue)]">{diasComDatas}</strong>
                    <br />
                    <span className="text-[0.8rem] text-[var(--gray)]">Horário: {horarioLabel}</span>
                    <br />
                    <span className="text-[0.8rem] text-[var(--gray)]">Unidade: {unidadeLabel(form.unidade)}</span>
                  </>
                ) : (
                  <p className="text-[0.82rem] text-[var(--gray)]">
                    Data e horário: <strong className="text-[0.95rem] text-[var(--blue)]">{diasComDatas} às {horarioLabel}</strong>
                    <br />
                    Unidade: <strong className="text-[0.95rem] text-[var(--blue)]">{unidadeLabel(form.unidade)}</strong>
                  </p>
                )}
              </div>

              <div className="mb-6 flex items-start justify-center gap-2 rounded-xl bg-[#FEF3F2] p-4 text-center text-[0.82rem] leading-relaxed text-[var(--red-dark)]">
                <ExclamationTriangleIcon className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Tolerância de até <strong>10 minutos</strong> de atraso. Após esse tempo, sua vaga pode ser perdida.
                </span>
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
