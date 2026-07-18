import { Suspense } from "react";
import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin — Login",
};

export default function AdminLoginPage() {
  return (
    <div className="theme-matricula flex min-h-screen items-center justify-center bg-[var(--blue)] px-4">
      <div className="w-full max-w-[380px] rounded-[20px] bg-white p-8 shadow-2xl">
        <h1 className="font-heading mb-6 text-center text-2xl tracking-[0.03em] text-[var(--blue)]">
          Área administrativa
        </h1>
        <Suspense fallback={null}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
