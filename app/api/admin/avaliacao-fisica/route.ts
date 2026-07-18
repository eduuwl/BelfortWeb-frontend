import { NextRequest } from "next/server";
import { proxyAdminList } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  return proxyAdminList("/avaliacao-fisica", request.nextUrl.search);
}
