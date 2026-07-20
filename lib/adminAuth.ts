// Só deve ser importado por Route Handlers (app/api/admin/**) — nunca por componentes "use client"
// nem por páginas renderizadas no cliente. Guarda e lê o token de sessão do admin num cookie httpOnly.

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL } from "@/lib/api";

export const ADMIN_SESSION_COOKIE = "belfort_admin_session";

const DEFAULT_SESSION_SECONDS = 8 * 60 * 60;

export async function getAdminToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_SESSION_COOKIE)?.value ?? null;
}

export async function setAdminSession(token: string, expiresIn?: number) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: expiresIn ?? DEFAULT_SESSION_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
}

/** Repassa uma listagem GET pro backend externo, anexando o Bearer token guardado no cookie httpOnly. */
export async function proxyAdminList(backendPath: string, search: string): Promise<NextResponse> {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ message: "Sessão expirada. Faça login novamente." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${backendPath}${search}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return NextResponse.json({ message: "Falha de conexão com o servidor. Tente novamente." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

/** Repassa um DELETE de registro pro backend externo, com o Bearer token. */
export async function proxyAdminDelete(backendPath: string): Promise<NextResponse> {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ message: "Sessão expirada. Faça login novamente." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${backendPath}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
  } catch {
    return NextResponse.json({ message: "Falha de conexão com o servidor. Tente novamente." }, { status: 502 });
  }

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

/** Repassa um upload multipart/form-data (ex.: imagem de banner) pro backend externo, com o Bearer token. */
export async function proxyAdminUpload(backendPath: string, formData: FormData): Promise<NextResponse> {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ message: "Sessão expirada. Faça login novamente." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${backendPath}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
  } catch {
    return NextResponse.json({ message: "Falha de conexão com o servidor. Tente novamente." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}

/** Repassa uma ação PATCH (ex.: confirmar presença) pro backend externo, com o Bearer token. */
export async function proxyAdminPatch(backendPath: string, body: unknown): Promise<NextResponse> {
  const token = await getAdminToken();
  if (!token) {
    return NextResponse.json({ message: "Sessão expirada. Faça login novamente." }, { status: 401 });
  }

  let res: Response;
  try {
    res = await fetch(`${API_URL}${backendPath}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  } catch {
    return NextResponse.json({ message: "Falha de conexão com o servidor. Tente novamente." }, { status: 502 });
  }

  const data = await res.json().catch(() => null);
  return NextResponse.json(data, { status: res.status });
}
