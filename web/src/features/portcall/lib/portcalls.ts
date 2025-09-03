import { fetchWithCsrf } from "@/lib/http";
import type { PortCall } from "../data/schema";

export type GetPortCallsParams = {
  page?: number;
  perPage?: number;
  q?: string;
  status?: string;
};

export type PortCallsResponse = {
  data: PortCall[];
  meta?: any;
};

export function parsePortCallsResponse(payload: any): PortCallsResponse {
  if (payload && Array.isArray(payload.data)) {
    return { data: payload.data as PortCall[], meta: payload.meta };
  }
  if (Array.isArray(payload)) {
    return { data: payload as PortCall[] };
  }
  return { data: [] };
}

export async function getPortCalls(params: GetPortCallsParams = {}): Promise<PortCallsResponse> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || "";
  const url = new URL(`${base}/port-calls`);
  const search = new URLSearchParams();
  // Pagination (Laravel: page, per_page)
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));

  // Text search (keep consistent with users: search_term)
  if (params.q && params.q.trim() !== "") {
    search.set("search_term", params.q.trim());
  }

  // Optional status filter if backend supports it
  if (params.status && params.status !== "all") {
    search.set("status", params.status);
  }

  url.search = search.toString();

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch port calls");
  const payload = await res.json();
  return parsePortCallsResponse(payload);
}

export async function getPortCallById(id: number): Promise<PortCall> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL || "";
  const url = new URL(`${base}/port-calls/${id}`);
  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch port call");
  const payload = await res.json();
  // Accept either { data: {...} } or direct object
  return (payload?.data ?? payload) as PortCall;
}
