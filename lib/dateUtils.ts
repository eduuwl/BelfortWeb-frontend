const DIAS_SEMANA_INDEX: Record<string, number> = {
  Domingo: 0,
  Segunda: 1,
  Terça: 2,
  Quarta: 3,
  Quinta: 4,
  Sexta: 5,
  Sábado: 6,
};

export function formatarDataBr(data: Date): string {
  return data.toLocaleDateString('pt-BR', { timeZone: 'America/Belem' });
}

/** Próxima data que cai no dia da semana informado — inclui hoje, se hoje já for esse dia. */
export function proximaData(diaSemana: string, hoje = new Date()): Date {
  const alvo = DIAS_SEMANA_INDEX[diaSemana];
  const data = new Date(hoje);
  data.setHours(0, 0, 0, 0);
  while (data.getDay() !== alvo) {
    data.setDate(data.getDate() + 1);
  }
  return data;
}

/** true se `data` cai no mesmo dia (ano/mês/dia) que `agora`. */
export function ehHoje(data: Date, agora = new Date()): boolean {
  return (
    data.getFullYear() === agora.getFullYear() &&
    data.getMonth() === agora.getMonth() &&
    data.getDate() === agora.getDate()
  );
}

/** true se o horário `HH:MM` informado já passou hoje, comparado ao horário atual. */
export function horarioJaPassouHoje(horario: string, agora = new Date()): boolean {
  const [h, m] = horario.split(':').map(Number);
  const alvo = new Date(agora);
  alvo.setHours(h, m, 0, 0);
  return agora.getTime() > alvo.getTime();
}

/**
 * Datas (dd/mm/aaaa) de cada dia da semana em `diasSemana`, em ordem.
 * Cada data é calculada a partir da anterior (não sempre a partir de hoje), pra respeitar
 * sequências que pulam o fim de semana (ex: Quinta, Sexta, Segunda).
 */
export function proximasDatas(diasSemana: string[], hoje = new Date()): string[] {
  const datas: Date[] = [];
  let referencia = hoje;
  for (const dia of diasSemana) {
    const data = proximaData(dia, referencia);
    datas.push(data);
    referencia = data;
  }
  return datas.map(formatarDataBr);
}
