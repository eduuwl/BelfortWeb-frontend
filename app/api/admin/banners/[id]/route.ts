import { NextRequest } from "next/server";
import { proxyAdminDelete, proxyAdminPatch } from "@/lib/adminAuth";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json().catch(() => null);
  return proxyAdminPatch(`/admin/banners/${id}`, body);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdminDelete(`/admin/banners/${id}`);
}
