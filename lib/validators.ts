export function cpfValido(cpfRaw: string): boolean {
  const cpf = cpfRaw.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let s = 0;
  for (let i = 0; i < 9; i++) s += parseInt(cpf[i], 10) * (10 - i);
  let r = (s * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(cpf[9], 10)) return false;

  s = 0;
  for (let i = 0; i < 10; i++) s += parseInt(cpf[i], 10) * (11 - i);
  r = (s * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(cpf[10], 10);
}

export function maskCPF(value: string): string {
  let v = value.replace(/\D/g, '').slice(0, 11);
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d)/, '$1.$2');
  v = v.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  return v;
}

export function maskPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Exige nome completo de verdade (pelo menos 3 partes — nome, nome do meio e sobrenome), não só
// "primeiro e último nome". Ex: "João Silva" é rejeitado, "João Costa Silva" passa. Cada parte
// precisa ter 2+ letras — sem números/símbolos.
export function nomeCompletoValido(nomeRaw: string): boolean {
  const partes = nomeRaw.trim().split(/\s+/).filter(Boolean);
  if (partes.length < 3) return false;
  return partes.every((parte) => parte.length >= 2 && /^[A-Za-zÀ-ÖØ-öø-ÿ'-]+$/.test(parte));
}

/** `nascimentoISO` no formato do `<input type="date">` (`aaaa-mm-dd`). `null` se vazio/inválido. */
export function calcularIdade(nascimentoISO: string): number | null {
  if (!nascimentoISO) return null;
  const [ano, mes, dia] = nascimentoISO.split('-').map(Number);
  if (!ano || !mes || !dia) return null;

  const hoje = new Date();
  let idade = hoje.getFullYear() - ano;
  const aniversarioJaPassouEsteAno = hoje.getMonth() + 1 > mes || (hoje.getMonth() + 1 === mes && hoje.getDate() >= dia);
  if (!aniversarioJaPassouEsteAno) idade--;
  return idade;
}

export function isMenorDeIdade(nascimentoISO: string): boolean {
  const idade = calcularIdade(nascimentoISO);
  return idade !== null && idade < 18;
}
