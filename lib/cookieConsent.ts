export type CookieConsent = { analytics: boolean };

const STORAGE_KEY = "belfort-cookie-consent";
const CHANGE_EVENT = "cookie-consent-change";
const OPEN_EVENT = "cookie-consent-open";

// useSyncExternalStore requires getSnapshot to return the same reference when the
// underlying value hasn't changed, so we cache the parsed result instead of
// re-parsing (and allocating a new object) on every call.
let cachedConsent: CookieConsent | null | undefined;

function readConsent(): CookieConsent | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.analytics === "boolean" ? { analytics: parsed.analytics } : null;
  } catch {
    return null;
  }
}

export function getStoredConsent(): CookieConsent | null {
  if (cachedConsent === undefined) {
    cachedConsent = readConsent();
  }
  return cachedConsent;
}

export function setStoredConsent(consent: CookieConsent): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(consent));
  cachedConsent = consent;
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function subscribeToConsent(cb: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, cb);
  return () => window.removeEventListener(CHANGE_EVENT, cb);
}

export function requestCookiePreferences(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onCookiePreferencesRequested(cb: () => void): () => void {
  window.addEventListener(OPEN_EVENT, cb);
  return () => window.removeEventListener(OPEN_EVENT, cb);
}
