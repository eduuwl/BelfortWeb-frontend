"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { deleteBanner, fetchBanners, updateBanner, uploadBanner, type BannerAdminRecord } from "@/lib/adminApi";
import { useSoftDelete } from "@/lib/useSoftDelete";
import ConfirmDialog from "./ConfirmDialog";
import UndoToast from "./UndoToast";
import DeleteButton from "./DeleteButton";

const RECOMMENDED_RATIO = 1600 / 500;
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function BannerManager({ records }: { records: BannerAdminRecord[] }) {
  const { items, setItems, pending, requestDelete, undo, undoWindowMs, error, dismissError } = useSoftDelete(
    records,
    deleteBanner,
  );

  const [confirmAlvo, setConfirmAlvo] = useState<BannerAdminRecord | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [toggleError, setToggleError] = useState<{ id: string; message: string } | null>(null);

  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [ordem, setOrdem] = useState(items.length + 1);
  const [link, setLink] = useState("");
  const [alt, setAlt] = useState("");
  const [uploadWarning, setUploadWarning] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!preview) return;
    return () => URL.revokeObjectURL(preview);
  }, [preview]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    setUploadError(null);
    setUploadWarning(null);
    setPreview(null);

    if (!f) return;

    if (f.size > MAX_SIZE_BYTES) {
      setUploadWarning("Essa imagem passa de 5MB — considere comprimir antes de enviar.");
    }

    const url = URL.createObjectURL(f);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      const ratio = img.width / img.height;
      if (Math.abs(ratio - RECOMMENDED_RATIO) > 0.15) {
        setUploadWarning((prev) =>
          prev
            ? `${prev} A proporção ideal é 1600×500, essa imagem pode aparecer cortada.`
            : "A proporção ideal é 1600×500 (faixa larga) — essa imagem pode aparecer cortada no carrossel.",
        );
      }
    };
    img.src = url;
  }

  async function handleUpload(e: FormEvent) {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("imagem", file);
    formData.append("ordem", String(ordem));
    formData.append("ativo", "true");
    formData.append("link", link.trim());
    formData.append("alt", alt.trim() || "Banner promocional Academia Belfort");

    const result = await uploadBanner(formData);

    if (!result.ok) {
      setUploading(false);
      setUploadError(result.message);
      return;
    }

    // Recarrega a lista do GET em vez de confiar no objeto devolvido pelo POST, pra garantir que
    // o que aparece na tela sempre vem do mesmo formato canônico (evita ids/campos inconsistentes).
    const refreshed = await fetchBanners();
    setUploading(false);

    if (refreshed.ok) {
      setItems(refreshed.result.data);
    } else {
      setUploadError("Banner enviado, mas não foi possível atualizar a lista. Atualize a página.");
    }

    setFile(null);
    setPreview(null);
    setLink("");
    setAlt("");
    setOrdem(items.length + 2);
  }

  async function toggleAtivo(banner: BannerAdminRecord) {
    setTogglingId(banner.id);
    setToggleError(null);
    const result = await updateBanner(banner.id, { ativo: !banner.ativo });
    setTogglingId(null);

    if (!result.ok) {
      setToggleError({ id: banner.id, message: result.message });
      return;
    }

    setItems((prev) => prev.map((b) => (b.id === banner.id ? { ...b, ativo: !b.ativo } : b)));
  }

  return (
    <>
      <form
        onSubmit={handleUpload}
        className="mb-8 rounded-xl border border-[var(--gray-light)] bg-white p-5"
      >
        <h2 className="font-heading mb-4 text-lg tracking-[0.03em] text-[var(--blue)]">Novo banner</h2>

        <div className="mb-4 grid gap-4 sm:grid-cols-[320px_1fr]">
          <div>
            <div className="flex aspect-[16/5] items-center justify-center overflow-hidden rounded-lg border border-dashed border-[var(--gray-light)] bg-[var(--off-white)]">
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Prévia do banner" className="h-full w-full object-cover" />
              ) : (
                <span className="px-2 text-center text-[0.72rem] text-[var(--gray)]">Sem imagem selecionada</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-2 w-full text-[0.78rem]"
            />
            <p className="mt-1 text-[0.72rem] text-[var(--gray)]">Recomendado: 1600×500px, JPG/WebP, até 5MB.</p>
            {uploadWarning && <p className="mt-1 text-[0.72rem] text-[var(--red)]">{uploadWarning}</p>}
          </div>

          <div className="grid gap-3">
            <label className="grid gap-1 text-[0.78rem] font-semibold text-[var(--text)]">
              Ordem
              <input
                type="number"
                min={1}
                value={ordem}
                onChange={(e) => setOrdem(Number(e.target.value) || 1)}
                className="rounded-lg border-[1.5px] border-[var(--gray-light)] px-3 py-2 text-[0.85rem] outline-none focus:border-[var(--blue-light)]"
              />
            </label>
            <label className="grid gap-1 text-[0.78rem] font-semibold text-[var(--text)]">
              Link ao clicar (opcional)
              <input
                type="text"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="/cortesia"
                className="rounded-lg border-[1.5px] border-[var(--gray-light)] px-3 py-2 text-[0.85rem] outline-none focus:border-[var(--blue-light)]"
              />
            </label>
            <label className="grid gap-1 text-[0.78rem] font-semibold text-[var(--text)]">
              Texto alternativo
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Ex: Promoção matrícula sem taxa"
                className="rounded-lg border-[1.5px] border-[var(--gray-light)] px-3 py-2 text-[0.85rem] outline-none focus:border-[var(--blue-light)]"
              />
            </label>
          </div>
        </div>

        {uploadError && <p className="mb-3 text-[0.8rem] text-[var(--red)]">{uploadError}</p>}

        <button
          type="submit"
          disabled={!file || uploading}
          className="rounded-lg bg-[var(--red)] px-5 py-2.5 text-[0.82rem] font-semibold text-white transition-colors hover:bg-[var(--red-dark)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          {uploading ? "Enviando..." : "Enviar banner"}
        </button>
      </form>

      {items.length === 0 ? (
        <p className="text-[0.85rem] text-[var(--gray)]">Nenhum banner cadastrado ainda.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((banner) => (
            <div key={banner.id} className="overflow-hidden rounded-xl border border-[var(--gray-light)] bg-white">
              <div className="aspect-[16/5] bg-[var(--off-white)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={banner.imageUrl} alt={banner.alt} className="h-full w-full object-cover" />
              </div>
              <div className="p-4">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-[0.78rem] font-semibold text-[var(--text)]">Ordem {banner.ordem}</span>
                  <DeleteButton onClick={() => setConfirmAlvo(banner)} />
                </div>
                {banner.link && (
                  <p className="mb-2 truncate text-[0.75rem] text-[var(--gray)]">Link: {banner.link}</p>
                )}
                <button
                  type="button"
                  disabled={togglingId === banner.id}
                  onClick={() => toggleAtivo(banner)}
                  className={`w-full rounded-lg px-3 py-2 text-[0.78rem] font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${
                    banner.ativo
                      ? "border-[1.5px] border-[var(--gray-light)] text-[var(--text)] hover:border-[var(--red)] hover:text-[var(--red)]"
                      : "bg-[var(--blue)] text-white hover:bg-[var(--blue-mid)]"
                  }`}
                >
                  {togglingId === banner.id ? "Atualizando..." : banner.ativo ? "Ativo — desativar" : "Inativo — ativar"}
                </button>
                {toggleError && toggleError.id === banner.id && (
                  <p className="mt-1 text-[0.72rem] text-[var(--red)]">{toggleError.message}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {confirmAlvo && (
        <ConfirmDialog
          title="Apagar banner?"
          message="Tem certeza que deseja apagar este banner do carrossel?"
          onCancel={() => setConfirmAlvo(null)}
          onConfirm={() => {
            requestDelete(confirmAlvo);
            setConfirmAlvo(null);
          }}
        />
      )}

      {pending && (
        <UndoToast
          itemKey={pending.item.id}
          message="Banner apagado"
          durationMs={undoWindowMs}
          onUndo={undo}
          onExpire={() => {}}
        />
      )}

      {error && (
        <div className="fixed bottom-24 left-1/2 z-[220] w-[calc(100%-2rem)] max-w-[380px] -translate-x-1/2 rounded-xl bg-[var(--red-dark)] px-4 py-3 text-center text-[0.82rem] text-white shadow-2xl">
          {error}
          <button type="button" onClick={dismissError} className="ml-2 underline">
            ok
          </button>
        </div>
      )}
    </>
  );
}
