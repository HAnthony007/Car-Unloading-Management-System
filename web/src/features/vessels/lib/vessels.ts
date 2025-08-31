import { fetchWithCsrf } from "@/lib/http";
import { parseVesselsResponse } from "../data/vessels";

export type GetVesselsParams = {
  q?: string;
};

export async function getVessels(params: GetVesselsParams = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const url = new URL(`${base}/vessels`);
  const search = new URLSearchParams();
  if (params.q && params.q.trim() !== "") search.set("search_term", params.q.trim());
  url.search = search.toString();

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch vessels");
  const payload = await res.json();
  return parseVesselsResponse(payload);
}
