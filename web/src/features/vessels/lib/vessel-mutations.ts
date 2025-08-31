import { fetchWithCsrf } from "@/lib/http";

export type UpsertVesselPayload = {
  imoNo: string;
  name: string;
  flag?: string | null;
};

function toSnakePayload(p: UpsertVesselPayload) {
  return {
    imo_no: p.imoNo,
    vessel_name: p.name,
    flag: p.flag ?? null,
  } as const;
}

export async function createVessel(payload: UpsertVesselPayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/vessels`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toSnakePayload(payload)),
  });
  if (!res.ok) {
    let message = "Erreur lors de la création du navire";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function updateVessel(id: string | number, payload: UpsertVesselPayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/vessels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toSnakePayload(payload)),
  });
  if (!res.ok) {
    let message = "Erreur lors de la mise à jour du navire";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
