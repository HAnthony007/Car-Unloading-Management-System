let lastFetchAt: number | null = null;
let inFlight: Promise<void> | null = null;

export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
  return null;
}

export function getXsrfToken(): string | null {
  const token = getCookie("XSRF-TOKEN");
  return token ? decodeURIComponent(token) : null;
}

export function xsrfHeader(): Record<string, string> {
  const token = getXsrfToken();
  return token ? { "X-XSRF-TOKEN": token } : {};
}

/**
 * Ensure the Laravel Sanctum CSRF cookie is set before state-changing requests.
 * Deduplicates concurrent calls and throttles re-fetching via TTL.
 */
export async function ensureCsrfCookie(ttlMs: number = 5 * 60 * 1000): Promise<void> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const now = Date.now();
  const token = getXsrfToken();
  if (token && lastFetchAt && now - lastFetchAt < ttlMs) return;
  if (inFlight) return inFlight;
  inFlight = (async () => {
    try {
      await fetch(`${base}/sanctum/csrf-cookie`, {
        method: "GET",
        headers: { Accept: "application/json" },
        credentials: "include",
      });
      lastFetchAt = Date.now();
    } finally {
      inFlight = null;
    }
  })();
  return inFlight;
}
