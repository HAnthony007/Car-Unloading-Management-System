import { ensureCsrfCookie } from "@/lib/csrf";
import { fetchWithCsrf } from "@/lib/http";

export type ManifestApiResponse = {
  message?: string;
  data?: {
    vessels_created: number;
    port_calls_created: number;
    vehicles_created: number;
    follow_up_files_created: number;
    vehicles_skipped: number;
    errors?: string[];
  };
};

export async function uploadManifest(file: File): Promise<ManifestApiResponse> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_BACKEND_API_BASE_URL est manquant dans l'environnement");
  }
  const formData = new FormData();
  formData.append("file", file);
  await ensureCsrfCookie();
  const res = await fetchWithCsrf(`${base}/imports/manifest`, {
    method: "POST",
    body: formData,
  });
  let payload: any = null;
  try {
    payload = await res.json();
  } catch {
    // ignore json parse errors
  }
  if (!res.ok) {
    // Backend now returns: { message, rolled_back, stats, errors } with 422
    const msg: string = payload?.message || `Echec de l'import (${res.status})`;
    const apiErrors: string[] = Array.isArray(payload?.errors)
      ? (payload.errors as string[])
      : Array.isArray(payload?.data?.errors)
      ? (payload.data.errors as string[])
      : [];
    const err = new Error(msg) as Error & { errors?: string[]; status?: number };
    err.errors = apiErrors;
    err.status = res.status;
    throw err;
  }
  return (payload as ManifestApiResponse) || {};
}
