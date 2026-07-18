"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchMatriculas, type MatriculaRecord } from "@/lib/adminApi";
import MatriculaTable from "@/components/admin/MatriculaTable";

export default function MatriculasPage() {
  const router = useRouter();
  const [records, setRecords] = useState<MatriculaRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchMatriculas().then((result) => {
      if (!active) return;
      if (!result.ok) {
        if (result.status === 401) {
          router.push("/admin/login");
          return;
        }
        setError(result.message);
        return;
      }
      setRecords(result.result.data);
    });
    return () => {
      active = false;
    };
  }, [router]);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Pré-cadastros</h1>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && <MatriculaTable records={records} />}
    </div>
  );
}
