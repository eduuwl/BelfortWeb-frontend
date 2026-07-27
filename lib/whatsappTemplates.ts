export interface MatriculaTemplateData {
  nome: string;
  numero: string;
}

export function buildMatriculaConfirmMessage({ nome, numero }: MatriculaTemplateData): string {
  return `*Sua matrícula foi criada com sucesso!* 🎉

Matrícula: *${numero}*

Nome: _*${nome}*_

Você pode ativá-la agora mesmo via *PIX* ou diretamente na *Recepção* .

⚠️📸 *Atenção* : Para concluir o cadastro, precisamos que você nos envie uma *foto de perfil* . Pode ser pelo WhatsApp mesmo.

_Seja bem-vinda(o) à Belfort Academia! Estamos aqui para ajudar você a alcançar seus objetivos._ 💪`;
}

export interface AvaliacaoTemplateData {
  nome: string;
  diaSemana: string;
  data: string;
  horario: string;
}

// "Segunda" -> "Segunda-feira" etc., seguindo o texto de exemplo fornecido ("Sexta-feira").
// Sábado e Domingo não levam "-feira".
function diaComFeira(diaSemana: string): string {
  return diaSemana === "Sábado" || diaSemana === "Domingo" ? diaSemana : `${diaSemana}-feira`;
}

export function buildAvaliacaoConfirmMessage({ nome, diaSemana, data, horario }: AvaliacaoTemplateData): string {
  return `NOME : *${nome}*

*Sua avaliação física foi agendada para ${diaComFeira(diaSemana)} dia ${data} às ${horario}h*

📋 *Orientações para sua Avaliação Física e Bioimpedância*

Para que sua avaliação seja precisa e tranquila, siga essas dicas simples:

👕 *Antes da Avaliação Física*:

Vista roupas leves: escolha peças confortáveis e sem metais, como short, top ou regata.

Evite fazer exercícios no mesmo dia, isso pode alterar os resultados.

Não passe cremes ou óleos no corpo no dia da avaliação.

Coma algo leve antes da avaliação, evite refeições pesadas.

⚖️ *Para a Bioimpedância*:

Avise sobre peças metálicas que não podem ser removidas.

Evite cafeína (café, chá, energéticos) antes do exame.

Hidrate-se com um copo de água e esvazie a bexiga antes.

Informe se está grávida ou se suspeita de gravidez.

Cabelos secos são essenciais para o teste.

Se estiver no período menstrual, prefira remarcar a avaliação.

📌*Outras Dicas Importantes*:

Informe o uso de medicamentos, como corticoides ou outros que possam causar retenção de líquidos.

Com essas orientações, garantimos uma avaliação mais precisa e um planejamento perfeito para seus objetivos! 💪✨

Agora é só seguir as recomendações e arrasar! 🚀`;
}

export interface CortesiaTemplateData {
  nome: string;
  modalidade: string;
  /** Pode ser um único dia ("Sexta") ou vários separados por vírgula ("Segunda, Terça, Quarta"). */
  dia: string;
  /** Mesma cardinalidade de `dia`, no formato dd/mm/aaaa, separadas por vírgula. */
  datasAula: string;
  horario: string;
}

function diaComFeiraECortesia(diaSemana: string): string {
  return diaSemana === "Sábado" || diaSemana === "Domingo" ? diaSemana : `${diaSemana}-feira`;
}

function diasEDatasFormatados(dia: string, datasAula: string): string {
  const dias = dia.split(",").map((d) => d.trim());
  const datas = datasAula.split(",").map((d) => d.trim());
  return dias.map((d, i) => `${diaComFeiraECortesia(d)} dia ${datas[i] ?? ""}`).join(", ");
}

export function buildCortesiaConfirmMessage({ nome, modalidade, dia, datasAula, horario }: CortesiaTemplateData): string {
  return `NOME: *${nome}*

*Sua aula de cortesia de ${modalidade} foi confirmada!* 🎉

📅 ${diasEDatasFormatados(dia, datasAula)}
🕐 Horário: *${horario}*

📍 *Orientações para o seu dia*:

Chegue com uns 10 minutinhos de antecedência pra gente te receber com calma.

Vista roupas confortáveis e traga uma garrafinha de água.

⚠️ Tolerância de até *10 minutos* de atraso — depois desse tempo, sua vaga pode ser perdida.

Qualquer imprevisto, nos avise por aqui mesmo! 💪

_Estamos ansiosos pra te receber na Belfort!_`;
}

export function buildGenericContatoMessage(nome: string): string {
  return `Olá ${nome}, tudo bem? Aqui é da Academia Belfort! 😊`;
}

/** Monta o link wa.me para o número do CLIENTE (não o da academia), prefixando o DDI 55 quando ausente. */
export function whatsappLinkForCustomer(whatsappDigits: string, message: string): string {
  const digits = whatsappDigits.replace(/\D/g, "");
  const withCountryCode = digits.startsWith("55") ? digits : `55${digits}`;
  return `https://wa.me/${withCountryCode}?text=${encodeURIComponent(message)}`;
}
