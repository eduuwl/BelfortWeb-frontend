"use client";

import { fetchBanners } from "@/lib/adminApi";
import { useAdminList } from "@/lib/useAdminList";
import BannerManager from "@/components/admin/BannerManager";
import Pagination from "@/components/admin/Pagination";

export default function BannersPage() {
  const { records, error, page, total, limit, loading, goToPage } = useAdminList(fetchBanners);

  return (
    <div>
      <h1 className="font-heading mb-6 text-2xl tracking-[0.03em] text-[var(--blue)]">Banners</h1>
      {error && <p className="text-[0.85rem] text-[var(--red)]">{error}</p>}
      {!error && !records && <p className="text-[0.85rem] text-[var(--gray)]">Carregando...</p>}
      {!error && records && (
        <>
          <BannerManager key={page} records={records} />
          <Pagination page={page} total={total} limit={limit} onChange={goToPage} disabled={loading} />
        </>
      )}
    </div>
  );
}
