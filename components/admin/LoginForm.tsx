"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BtnPrimary, FieldInput, LoadingOverlay } from "@/components/form/FormControls";
import { adminLogin } from "@/lib/adminApi";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await adminLogin(usuario.trim(), senha);
    setLoading(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    router.push(searchParams.get("next") || "/admin");
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldInput label="Usuário" value={usuario} onChange={setUsuario} placeholder="Seu usuário" />
      <FieldInput label="Senha" type="password" value={senha} onChange={setSenha} placeholder="••••••••" />

      {error && <p className="mb-4 text-center text-[0.82rem] text-[var(--red)]">{error}</p>}

      <BtnPrimary type="submit" disabled={loading || !usuario.trim() || !senha}>
        Entrar
      </BtnPrimary>

      <LoadingOverlay show={loading} />
    </form>
  );
}
