"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Script from "next/script";
import {
  getStoredConsent,
  setStoredConsent,
  subscribeToConsent,
  onCookiePreferencesRequested,
  type CookieConsent,
} from "@/lib/cookieConsent";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function getServerConsentSnapshot(): CookieConsent | null {
  return null;
}

export default function CookieConsent() {
  const consent = useSyncExternalStore(subscribeToConsent, getStoredConsent, getServerConsentSnapshot);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [analyticsDraft, setAnalyticsDraft] = useState(false);

  useEffect(
    () =>
      onCookiePreferencesRequested(() => {
        setAnalyticsDraft(getStoredConsent()?.analytics ?? false);
        setForcedOpen(true);
      }),
    [],
  );

  const panel: "hidden" | "banner" | "preferences" = forcedOpen ? "preferences" : consent === null ? "banner" : "hidden";

  function apply(next: CookieConsent) {
    setStoredConsent(next);
    setForcedOpen(false);
  }

  return (
    <>
      {consent?.analytics && GA_ID && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}');
            `}
          </Script>
        </>
      )}

      {panel !== "hidden" && (
        <div className="fixed inset-x-0 bottom-0 z-[300] border-t border-white/10 bg-[#0d1f3c] px-5 py-5 shadow-[0_-8px_30px_rgba(0,0,0,0.35)] sm:px-8">
          <div className="mx-auto max-w-[1100px]">
            {panel === "banner" && (
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[0.85rem] leading-relaxed text-white/80">
                  Usamos cookies para melhorar sua experiência e entender como você usa o site. Você pode
                  aceitar todos, rejeitar os não essenciais ou escolher suas preferências.
                </p>
                <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setAnalyticsDraft(consent?.analytics ?? false);
                      setForcedOpen(true);
                    }}
                    className="rounded-lg border-[1.5px] border-white/25 px-4 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:border-white/50"
                  >
                    Preferências
                  </button>
                  <button
                    type="button"
                    onClick={() => apply({ analytics: false })}
                    className="rounded-lg border-[1.5px] border-white/25 px-4 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:border-white/50"
                  >
                    Rejeitar
                  </button>
                  <button
                    type="button"
                    onClick={() => apply({ analytics: true })}
                    className="rounded-lg bg-[#cc3738] px-4 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#8f1f20]"
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            )}

            {panel === "preferences" && (
              <div>
                <h2 className="font-heading mb-3 text-lg tracking-[0.03em] text-white">Preferências de cookies</h2>

                <div className="mb-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-[0.85rem] font-semibold text-white">Cookies necessários</p>
                      <p className="text-[0.78rem] text-white/60">
                        Essenciais para o funcionamento do site (ex: login administrativo). Sempre ativos.
                      </p>
                    </div>
                    <input type="checkbox" checked disabled className="h-5 w-5 shrink-0 accent-white/40" />
                  </div>

                  <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 px-4 py-3">
                    <div>
                      <p className="text-[0.85rem] font-semibold text-white">Cookies analíticos (Google Analytics)</p>
                      <p className="text-[0.78rem] text-white/60">
                        Nos ajudam a entender como o site é usado, pra melhorar a experiência.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={analyticsDraft}
                      onChange={(e) => setAnalyticsDraft(e.target.checked)}
                      className="h-5 w-5 shrink-0 accent-[#cc3738]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => apply({ analytics: analyticsDraft })}
                    className="rounded-lg bg-[#cc3738] px-4 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:bg-[#8f1f20]"
                  >
                    Salvar preferências
                  </button>
                  <button
                    type="button"
                    onClick={() => apply({ analytics: true })}
                    className="rounded-lg border-[1.5px] border-white/25 px-4 py-2.5 text-[0.8rem] font-semibold text-white transition-colors hover:border-white/50"
                  >
                    Aceitar todos
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
