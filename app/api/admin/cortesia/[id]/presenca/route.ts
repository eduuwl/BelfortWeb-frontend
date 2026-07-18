import { NextRequest } from "next/server";
import { proxyAdminPatch } from "@/lib/adminAuth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  return proxyAdminPatch(`/cortesia/${id}/presenca`, { confirmada: Boolean(body?.confirmada) });
}
