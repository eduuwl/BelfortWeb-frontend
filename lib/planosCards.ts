import { AcademicCapIcon, BoltIcon, FaceSmileIcon, FireIcon } from "@heroicons/react/24/solid";
import type { IconType } from "@/components/form/FormControls";

export interface PlanoCard {
  nome: string;
  periodo: string;
  preco: string;
  parcela: string;
  features: string[];
  destaque?: boolean;
}

export interface Grupo {
  icon: IconType;
  label: string;
  planos: PlanoCard[];
}

const PRIME: PlanoCard = {
  nome: "Belfort Prime",
  periodo: "Mensal · 2 unidades",
  preco: "120",
  parcela: "à vista",
  features: [
    "Acesso à musculação",
    "Treine em Telégrafo e Sacramenta",
    "Horário livre",
    "Seg a Sábado",
    "80+ aulas coletivas mensais",
  ],
};

export const TELEGRAFO: Grupo[] = [
  {
    icon: FireIcon,
    label: "Musculação",
    planos: [
      {
        nome: "Mensal",
        periodo: "Pagamento único",
        preco: "110",
        parcela: "à vista",
        features: ["Acesso à musculação", "Horário livre", "Seg a Sábado", "80+ aulas coletivas mensais"],
      },
      {
        nome: "Trimestral",
        periodo: "3 meses",
        preco: "315",
        parcela: "ou 3x de R$ 105,00",
        features: [
          "Acesso à musculação",
          "Horário livre",
          "Seg a Sábado",
          "80+ aulas coletivas mensais",
          "Melhor custo-benefício",
        ],
        destaque: true,
      },
      {
        nome: "Semestral",
        periodo: "6 meses",
        preco: "600",
        parcela: "ou 6x de R$ 100,00",
        features: [
          "Acesso à musculação",
          "Horário livre",
          "Seg a Sábado",
          "80+ aulas coletivas mensais",
          "Maior economia",
        ],
      },
      PRIME,
    ],
  },
  {
    icon: BoltIcon,
    label: "Cross Training",
    planos: [
      {
        nome: "Mensal",
        periodo: "Pagamento único",
        preco: "190",
        parcela: "à vista",
        features: ["Aulas em grupo", "Todos os horários", "Seg a Sábado", "80+ aulas coletivas mensais"],
      },
      {
        nome: "Trimestral",
        periodo: "3 meses",
        preco: "510",
        parcela: "ou 3x de R$ 170,00",
        features: [
          "Aulas em grupo",
          "Todos os horários",
          "Seg a Sábado",
          "80+ aulas coletivas mensais",
          "Melhor custo-benefício",
        ],
        destaque: true,
      },
      {
        nome: "Semestral",
        periodo: "6 meses",
        preco: "900",
        parcela: "ou 6x de R$ 150,00",
        features: [
          "Aulas em grupo",
          "Todos os horários",
          "Seg a Sábado",
          "80+ aulas coletivas mensais",
          "Maior economia",
        ],
      },
    ],
  },
  {
    icon: FaceSmileIcon,
    label: "Funcional Kids",
    planos: [
      {
        nome: "Mensal",
        periodo: "Seg, Qua e Sex · 17h",
        preco: "120",
        parcela: "à vista",
        features: ["Turma exclusiva kids", "Unidade Telégrafo", "Acompanhamento especializado"],
      },
    ],
  },
  {
    icon: AcademicCapIcon,
    label: "Personal Trainer",
    planos: [
      {
        nome: "Mensal",
        periodo: "Taxa de acesso",
        preco: "50",
        parcela: "à vista",
        features: ["Traga seu personal trainer", "CREF obrigatório", "Válido nas 2 unidades"],
      },
    ],
  },
];

export const SACRAMENTA: Grupo[] = [
  {
    icon: FireIcon,
    label: "Musculação",
    planos: [
      {
        nome: "Mensal",
        periodo: "Pagamento único",
        preco: "100",
        parcela: "à vista",
        features: ["Acesso à musculação", "Horário livre", "80+ aulas coletivas mensais", "Seg a Sábado"],
        destaque: true,
      },
      PRIME,
    ],
  },
  {
    icon: AcademicCapIcon,
    label: "Personal Trainer",
    planos: [
      {
        nome: "Mensal",
        periodo: "Taxa de acesso",
        preco: "50",
        parcela: "à vista",
        features: ["Traga seu personal trainer", "CREF obrigatório", "Válido nas 2 unidades"],
      },
    ],
  },
];

function buildTeaser(grupos: Grupo[]): PlanoCard[] {
  return grupos.map((grupo) => ({
    ...grupo.planos[0],
    nome: grupo.label,
    periodo: "A partir de · por mês",
  }));
}

export const PLANOS_TEASER_TELEGRAFO: PlanoCard[] = buildTeaser(TELEGRAFO);
export const PLANOS_TEASER_SACRAMENTA: PlanoCard[] = buildTeaser(SACRAMENTA);
