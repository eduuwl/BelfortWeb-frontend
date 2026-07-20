"use client";

import { requestCookiePreferences } from "@/lib/cookieConsent";

export default function CookiePreferencesButton() {
  return (
    <button
      type="button"
      onClick={requestCookiePreferences}
      className="text-[0.78rem] uppercase tracking-[0.08em] text-white/40 transition-colors hover:text-white"
    >
      Preferências de cookies
    </button>
  );
}
