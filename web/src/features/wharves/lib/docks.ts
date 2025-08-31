import { fetchWithCsrf } from "@/lib/http";
import type { DocksResponse } from "../types";

export async function getDocks(): Promise<DocksResponse> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const url = new URL(`${base}/docks`);

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch docks");
  const payload = (await res.json()) as DocksResponse;
  return payload;
}
