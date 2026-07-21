// Netlify Scheduled Function: faz um ping periódico no backend (Render, plano Free) pra
// impedir que ele "durma" por inatividade — o Render coloca serviços Free pra dormir depois de
// ~15min sem requisições, e o próximo acesso demora dezenas de segundos pra "acordar" o serviço.
// Rodando a cada 10 minutos, mantemos essa janela sempre coberta.
export const config = { schedule: "*/10 * * * *" };

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://academia-belfort-backend.onrender.com";

async function keepBackendAwake() {
  try {
    await fetch(`${API_URL}/banners`);
  } catch {
    // Ignora falhas — o único objetivo aqui é gerar tráfego pro backend, não importa a resposta.
  }
}

export default keepBackendAwake;
