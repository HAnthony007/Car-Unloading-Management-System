import { fetchWithCsrf } from "@/lib/http";
import { parseVehiclesResponse } from "../data/vehicles";

export type GetVehiclesParams = {
  page?: number;
  perPage?: number;
  q?: string;
  ownerName?: string;
  color?: string;
  type?: string;
  originCountry?: string;
};

export async function getVehicles(params: GetVehiclesParams = {}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/vehicles`);
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));
  if (params.q && params.q.trim() !== "") search.set("search_term", params.q.trim());
  if (params.ownerName && params.ownerName.trim() !== "") search.set("owner_name", params.ownerName.trim());
  if (params.color && params.color.trim() !== "") search.set("color", params.color.trim());
  if (params.type && params.type.trim() !== "") search.set("type", params.type.trim());
  if (params.originCountry && params.originCountry.trim() !== "") search.set("origin_country", params.originCountry.trim());
  url.search = search.toString();

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  const payload = await res.json();
  return parseVehiclesResponse(payload);
}
