import { fetchWithCsrf } from "@/lib/http";
import { parseFollowupsResponse } from "../data/followup";

export type GetFollowupsParams = {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string; // optional filter if backend supports it
};

export async function getFollowups(params: GetFollowupsParams = {}) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const url = new URL(`${base}/follow-up-files`);
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));
  if (params.q && params.q.trim() !== "") search.set("search_term", params.q.trim());
  if (params.status) search.set("status", params.status);
  url.search = search.toString();

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    let message = `Failed to fetch follow-up files (HTTP ${res.status})`;
    try {
      const body = await res.clone().text();
      if (body) message += `: ${body.slice(0, 240)}`;
    } catch {}
    throw new Error(message);
  }
  const payload = await res.json();
  return parseFollowupsResponse(payload);
}
