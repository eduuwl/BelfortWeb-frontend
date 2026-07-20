"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchBanners, type BannerAdminRecord } from "@/lib/adminApi";
import BannerManager from "@/components/admin/BannerManager";

export default function BannersPage() {
  const router = useRouter();
  const [records, setRecords] = useState<BannerAdminRecord[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    fetchBanners().then((result) => {
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
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Banners</h1>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && <BannerManager records={records} />}
    </div>
  );
}
