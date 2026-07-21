import Image from "next/image";
import Link from "next/link";
import CookiePreferencesButton from "@/components/legal/CookiePreferencesButton";

export default function Footer() {
  return (
    <footer className="bg-[#080F1C] px-8 py-12">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6">
        <Image src="/images/logo.png" alt="Academia Belfort" width={1005} height={334} className="h-7 w-auto" />
        <div className="text-[0.78rem] text-white/30">
          Academia Belfort © 2026 · Belém, PA · CNPJ 18.353.376/0002-26
        </div>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://www.instagram.com/academiabelfort/"
            target="_blank"
            rel="noreferrer"
            className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            Instagram
          </a>
          <a
            href="https://www.facebook.com/acadbelfort/?locale=pt_BR"
            target="_blank"
            rel="noreferrer"
            className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            Facebook
          </a>
          <Link
            href="/sobre"
            className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            Sobre Nós
          </Link>
          <Link
            href="/politica-de-privacidade"
            className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            Política de Privacidade
          </Link>
          <Link
            href="/termos-de-uso"
            className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
          >
            Termos de Uso
          </Link>
          <CookiePreferencesButton />
        </div>
      </div>
    </footer>
  );
}
