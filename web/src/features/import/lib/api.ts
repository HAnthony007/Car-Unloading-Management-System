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
  let payload: ManifestApiResponse | null = null;
  try {
    payload = (await res.json()) as ManifestApiResponse;
  } catch {
    // ignore json parse errors
  }
  if (!res.ok) {
    const msg = payload?.message || `Echec de l'import (${res.status})`;
    const apiErrors = (payload?.data?.errors && payload?.data?.errors.length > 0 ? payload?.data?.errors : []) || [];
    const err = new Error([msg, ...apiErrors].join("\n"));
    throw err;
  }
  return payload || {};
}
