import { proxyAdminDelete } from "@/lib/adminAuth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyAdminDelete(`/avaliacao-fisica/${id}`);
}
