import {
  DIAS_CONSECUTIVOS,
  DIAS_KIDS,
  DIAS_SEMANA,
  HORARIOS_CROSS,
  HORARIOS_KIDS,
  HORARIOS_MUSC,
  type HorarioSlot,
} from "@/lib/horarios";
import { ehHoje, horarioJaPassouHoje, proximaData, proximasDatas } from "@/lib/dateUtils";
import type { Modalidade, Unidade } from "@/lib/planos";

export function modalidadeLabel(m: Modalidade | null): string {
  if (m === "musculacao") return "Musculação";
  if (m === "cross") return "Cross Training";
  if (m === "kids") return "Funcional Kids";
  return "";
}

export function unidadeLabel(u: Unidade | null): string {
  return u === "sacramenta" ? "Sacramenta" : "Telégrafo";
}

// Aos sábados a academia funciona só das 8h às 16h.
export function horarioValidoNoSabado(horario: string | null): boolean {
  return horario !== null && horario >= "08:00" && horario <= "16:00";
}

export function horariosParaModalidade(m: Modalidade | null): HorarioSlot[] {
  return m === "musculacao" ? HORARIOS_MUSC : m === "kids" ? HORARIOS_KIDS : HORARIOS_CROSS;
}

export interface CortesiaAgendamento {
  horarios: HorarioSlot[];
  horarioSelecionado: HorarioSlot | undefined;
  crossSomenteSabado: boolean;
  diasConsecutivos: string[];
  diasStr: string;
  horarioLabel: string;
  diasParaData: string[];
  datasArray: string[];
  datasAula: string;
  diasComDatas: string;
}

/** Deriva tudo que depende de modalidade+horário+dia: dias consecutivos do Cross, datas reais das
 * aulas, e os textos já formatados pro resumo/confirmação. Usado tanto pelo wizard público quanto
 * pelo cadastro rápido do admin, pra não duplicar essa regra (a parte mais delicada é o Cross
 * Training: a partir de um único dia escolhido, calcula as 3 aulas consecutivas automaticamente). */
export function deriveCortesiaAgendamento(
  modalidade: Modalidade | null,
  horario: string | null,
  dia: string | null,
): CortesiaAgendamento {
  const horarios = horariosParaModalidade(modalidade);
  const horarioSelecionado = horarios.find((h) => h.value === horario);
  const crossSomenteSabado = modalidade === "cross" && horarioSelecionado?.somenteSabado === true;

  const diasConsecutivos =
    modalidade === "cross" && dia
      ? crossSomenteSabado
        ? [dia]
        : (DIAS_CONSECUTIVOS[dia] ?? [])
      : [];
  const diasStr = modalidade === "cross" ? diasConsecutivos.join(", ") : (dia ?? "");
  const horarioLabel = horarioSelecionado?.label ?? horario ?? "";
  const diasParaData = modalidade === "cross" ? diasConsecutivos : dia ? [dia] : [];
  const datasArray = proximasDatas(diasParaData);
  const datasAula = datasArray.join(", ");
  const diasComDatas =
    modalidade === "cross"
      ? diasConsecutivos.map((d, i) => `${d} (${datasArray[i]})`).join(" · ")
      : dia && datasArray[0]
        ? `${dia} (${datasArray[0]})`
        : diasStr;

  return {
    horarios,
    horarioSelecionado,
    crossSomenteSabado,
    diasConsecutivos,
    diasStr,
    horarioLabel,
    diasParaData,
    datasArray,
    datasAula,
    diasComDatas,
  };
}

// O horário já foi escolhido antes do dia — se o dia candidato cair em hoje e esse horário já
// tiver passado, não faz sentido deixar marcar "hoje".
export function diaEstaDesabilitado(dia: string, horario: string | null): boolean {
  return ehHoje(proximaData(dia)) && horario !== null && horarioJaPassouHoje(horario);
}

export interface DiaOpcao {
  label: string;
  sub?: string;
}

/** Lista de dias oferecidos no step de escolha de dia, já considerando a modalidade e as regras
 * de sábado — a mesma lógica condicional usada no wizard público (Cross consecutivo, Kids fixo,
 * Musculação livre com corte de sábado). */
export function diasOpcoesParaModalidade(
  modalidade: Modalidade | null,
  crossSomenteSabado: boolean,
  horario: string | null,
): DiaOpcao[] {
  if (crossSomenteSabado) return [{ label: "Sábado" }];
  if (modalidade === "cross") {
    return Object.keys(DIAS_CONSECUTIVOS).map((d) => ({ label: d, sub: DIAS_CONSECUTIVOS[d].join(" · ") }));
  }
  if (modalidade === "kids") return DIAS_KIDS.map((d) => ({ label: d }));
  return DIAS_SEMANA.filter((d) => d !== "Sábado" || horarioValidoNoSabado(horario)).map((d) => ({ label: d }));
}
