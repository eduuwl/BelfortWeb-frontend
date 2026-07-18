"use client";

import type { AvaliacaoPayload, CortesiaPayload, MatriculaPayload } from "@/lib/api";

export interface MatriculaRecord extends MatriculaPayload {
  id: string;
  createdAt: string;
}

export interface CortesiaRecord extends CortesiaPayload {
  id: string;
  createdAt: string;
}

export interface AvaliacaoRecord extends AvaliacaoPayload {
  id: string;
  createdAt: string;
}

export interface ListResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export type ListFetchResult<T> =
  | { ok: true; result: ListResult<T> }
  | { ok: false; status: number; message: string };

const MENSAGEM_ERRO_PADRAO = "Não conseguimos carregar os dados agora. Tente novamente em instantes.";

async function getList<T>(path: string): Promise<ListFetchResult<T>> {
  try {
    const res = await fetch(path, { cache: "no-store" });
    const data = await res.json().catch(() => null);

    if (!res.ok) {
      const message = Array.isArray(data?.message) ? data.message[0] : data?.message;
      return { ok: false, status: res.status, message: message ?? MENSAGEM_ERRO_PADRAO };
    }

    return { ok: true, result: data as ListResult<T> };
  } catch {
    return { ok: false, status: 0, message: "Falha de conexão. Verifique sua internet e tente novamente." };
  }
}

export function fetchMatriculas(page = 1) {
  return getList<MatriculaRecord>(`/api/admin/matricula?page=${page}`);
}

export function fetchCortesias(page = 1) {
  return getList<CortesiaRecord>(`/api/admin/cortesia?page=${page}`);
}

export function fetchAvaliacoes(page = 1) {
  return getList<AvaliacaoRecord>(`/api/admin/avaliacao-fisica?page=${page}`);
}

export type LoginResult = { ok: true } | { ok: false; message: string };

export async function adminLogin(usuario: string, senha: string): Promise<LoginResult> {
  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ usuario, senha }),
    });

    if (res.ok) return { ok: true };

    const data = await res.json().catch(() => null);
    return { ok: false, message: data?.message ?? "Não foi possível entrar." };
  } catch {
    return { ok: false, message: "Falha de conexão. Verifique sua internet e tente novamente." };
  }
}

export async function adminLogout() {
  await fetch("/api/admin/logout", { method: "POST" });
}
