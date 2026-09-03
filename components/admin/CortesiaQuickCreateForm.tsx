"use client";

import { useState } from "react";
import { BoltIcon, FaceSmileIcon, FireIcon, MapPinIcon, PlusIcon } from "@heroicons/react/24/solid";
import {
  BtnPrimary,
  DiaButton,
  FieldInput,
  FieldLabel,
  HorarioButton,
  HorarioGrid,
  OptionButton,
  OptionGrid,
  ToggleRow,
} from "@/components/form/FormControls";
import { cpfValido, isValidEmail, maskCPF, maskPhone } from "@/lib/validators";
import {
  deriveCortesiaAgendamento,
  diasOpcoesParaModalidade,
  modalidadeLabel,
  unidadeLabel,
} from "@/lib/cortesiaLogic";
import { submitCortesia } from "@/lib/api";
import type { Modalidade, Unidade } from "@/lib/planos";

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

export default function CortesiaQuickCreateForm({ onCreated }: { onCreated: (unidade: Unidade) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function selectModalidade(m: Modalidade) {
    setForm((f) => ({
      ...f,
      modalidade: m,
      unidade: m === "musculacao" ? f.unidade : "telegrafo",
      horario: null,
      dia: null,
    }));
  }

  const { horarios, crossSomenteSabado, diasStr, horarioLabel, datasAula } = deriveCortesiaAgendamento(
    form.modalidade,
    form.horario,
    form.dia,
  );
  const diasOpcoes = diasOpcoesParaModalidade(form.modalidade, crossSomenteSabado, form.horario);

  const formOk =
    form.modalidade !== null &&
    (form.modalidade !== "musculacao" || form.unidade !== null) &&
    form.nome.trim().length >= 3 &&
    form.nome.trim().includes(" ") &&
    form.whatsapp.replace(/\D/g, "").length >= 10 &&
    isValidEmail(form.email.trim()) &&
    cpfValido(form.cpf) &&
    form.limitacao !== null &&
    form.horario !== null &&
    form.dia !== null;

  function resetForm() {
    setForm(INITIAL_STATE);
    setError(null);
  }

  async function handleSubmit() {
    if (!formOk) return;
    setSubmitting(true);
    setError(null);

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

    setSubmitting(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    resetForm();
    setOpen(false);
    onCreated(form.unidade ?? "telegrafo");
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mb-6 inline-flex items-center gap-1.5 rounded-lg bg-[var(--blue)] px-4 py-2.5 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[var(--blue-mid)]"
      >
        <PlusIcon className="h-4 w-4" />
        Nova cortesia
      </button>
    );
  }

  return (
    <div className="mb-8 rounded-xl border border-[var(--gray-light)] bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-heading text-lg tracking-[0.03em] text-[var(--blue)]">Nova cortesia</h2>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setOpen(false);
          }}
          className="text-[0.78rem] text-[var(--gray)] hover:text-[var(--text)]"
        >
          Cancelar
        </button>
      </div>

      <FieldLabel>Modalidade</FieldLabel>
      <OptionGrid>
        <OptionButton icon={FireIcon} label="Musculação" selected={form.modalidade === "musculacao"} onClick={() => selectModalidade("musculacao")} />
        <OptionButton icon={BoltIcon} label="Cross Training" selected={form.modalidade === "cross"} onClick={() => selectModalidade("cross")} />
        <OptionButton icon={FaceSmileIcon} label="Funcional Kids" selected={form.modalidade === "kids"} onClick={() => selectModalidade("kids")} />
      </OptionGrid>

      {form.modalidade === "musculacao" && (
        <>
          <FieldLabel>Unidade</FieldLabel>
          <OptionGrid>
            <OptionButton icon={MapPinIcon} label="Telégrafo" selected={form.unidade === "telegrafo"} onClick={() => update("unidade", "telegrafo")} />
            <OptionButton icon={MapPinIcon} label="Sacramenta" selected={form.unidade === "sacramenta"} onClick={() => update("unidade", "sacramenta")} />
          </OptionGrid>
        </>
      )}

      <FieldInput label="Nome completo" value={form.nome} onChange={(v) => update("nome", v)} placeholder="Ex: João Silva" />
      <FieldInput label="WhatsApp (com DDD)" value={form.whatsapp} onChange={(v) => update("whatsapp", maskPhone(v))} placeholder="Ex: 91988776655" />
      <FieldInput label="E-mail" type="email" value={form.email} onChange={(v) => update("email", v)} placeholder="seu@email.com" />
      <FieldInput label="CPF" value={form.cpf} onChange={(v) => update("cpf", maskCPF(v))} placeholder="000.000.000-00" maxLength={14} />

      <div className="mb-4">
        <FieldLabel>Possui alguma limitação física?</FieldLabel>
        <ToggleRow value={form.limitacao} onChange={(v) => update("limitacao", v)} />
        {form.limitacao && (
          <textarea
            value={form.limitacaoDesc}
            onChange={(e) => update("limitacaoDesc", e.target.value)}
            placeholder="Descreva brevemente a limitação..."
            className="h-20 w-full resize-none rounded-[10px] border-[1.5px] border-[var(--gray-light)] bg-white px-4 py-3 text-[0.95rem] text-[var(--text)] outline-none transition-all focus:border-[var(--blue-light)]"
          />
        )}
      </div>

      {form.modalidade && (
        <>
          <FieldLabel>Horário</FieldLabel>
          <HorarioGrid>
            {horarios.map((h) => (
              <HorarioButton
                key={h.value}
                label={h.label}
                selected={form.horario === h.value}
                onClick={() => setForm((f) => ({ ...f, horario: h.value, dia: null }))}
              />
            ))}
          </HorarioGrid>
        </>
      )}

      {form.modalidade && form.horario && (
        <>
          <FieldLabel>Dia</FieldLabel>
          <div className="mb-4 grid grid-cols-3 gap-2">
            {diasOpcoes.map((d) => (
              <DiaButton
                key={d.label}
                label={d.label}
                sub={d.sub}
                selected={form.dia === d.label}
                onClick={() => update("dia", d.label)}
              />
            ))}
          </div>
        </>
      )}

      {error && <p className="mb-3 text-[0.8rem] text-[var(--red)]">{error}</p>}

      <BtnPrimary disabled={!formOk || submitting} onClick={handleSubmit}>
        {submitting ? "Cadastrando..." : "Cadastrar cortesia"}
      </BtnPrimary>
    </div>
  );
}
