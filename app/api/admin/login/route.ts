import { NextRequest, NextResponse } from "next/server";
import { API_URL } from "@/lib/api";
import { setAdminSession } from "@/lib/adminAuth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body?.usuario || !body?.senha) {
    return NextResponse.json({ message: "Usuário e senha são obrigatórios." }, { status: 400 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}/admin/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario: body.usuario, senha: body.senha }),
    });
  } catch {
    return NextResponse.json({ message: "Falha de conexão com o servidor. Tente novamente." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
    return NextResponse.json({ message: message ?? "Não foi possível entrar." }, { status: res.status });
  }

  if (!data?.token) {
    return NextResponse.json({ message: "Resposta inválida do servidor." }, { status: 502 });
  }

  await setAdminSession(data.token, data.expiresIn);
  return NextResponse.json({ ok: true });
}
