"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCortesias, type CortesiaRecord } from "@/lib/adminApi";
import CortesiaTable from "@/components/admin/CortesiaTable";
import CortesiaQuickCreateForm from "@/components/admin/CortesiaQuickCreateForm";

export default function CortesiasPage() {
  const router = useRouter();
  const [records, setRecords] = useState<CortesiaRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchCortesias().then((result) => {
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

  async function refetch() {
    const result = await fetchCortesias();
    if (!result.ok) {
      if (result.status === 401) {
        router.push("/admin/login");
        return;
      }
      setError(result.message);
      return;
    }
    setError(null);
    setRecords(result.result.data);
  }

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Cortesias</h1>
      <CortesiaQuickCreateForm onCreated={refetch} />
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && <CortesiaTable records={records} />}
    </div>
  );
}
