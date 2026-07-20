import { NextRequest } from "next/server";
import { proxyAdminList, proxyAdminUpload } from "@/lib/adminAuth";

export async function GET(request: NextRequest) {
  return proxyAdminList("/admin/banners", request.nextUrl.search);
}

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  return proxyAdminUpload("/admin/banners", formData);
}
