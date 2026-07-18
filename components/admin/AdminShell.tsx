"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminLogout } from "@/lib/adminApi";

const TABS = [
  { href: "/admin/matriculas", label: "Pré-cadastros" },
  { href: "/admin/cortesias", label: "Cortesias" },
  { href: "/admin/avaliacoes", label: "Avaliações Físicas" },
  { href: "/admin/avaliacoes-nutricionais", label: "Avaliações Nutricionais" },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminLogout();
    router.push("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <header className="flex items-center justify-between border-b border-[var(--gray-light)] bg-white px-6 py-4">
        <span className="font-heading text-xl tracking-[0.03em] text-[var(--blue)]">Área administrativa</span>
        <button
          type="button"
          onClick={handleLogout}
          className="text-[0.82rem] font-semibold text-[var(--red)] hover:underline"
        >
          Sair
        </button>
      </header>

      <nav className="flex gap-1 border-b border-[var(--gray-light)] bg-white px-6">
        {TABS.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className={`px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.05em] transition-colors ${
              pathname === t.href
                ? "border-b-2 border-[var(--red)] text-[var(--red)]"
                : "text-[var(--gray)] hover:text-[var(--blue)]"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </nav>

      <main className="mx-auto max-w-[1100px] px-6 py-8">{children}</main>
    </div>
  );
}
