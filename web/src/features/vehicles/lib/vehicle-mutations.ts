import { fetchWithCsrf } from "@/lib/http";

export type UpsertVehiclePayload = {
  vin: string;
  make: string;
  model: string;
  year?: string | number | null;
  ownerName?: string | null;
  color?: string | null;
  type?: string | null;
  weight?: string | null;
  condition?: string | null;
  observation?: string | null;
  originCountry?: string | null;
  shipLocation?: string | null;
  isPrimed?: boolean | null;
  dischargeId?: number | null;
};

function toSnakePayload(p: UpsertVehiclePayload) {
  return {
    vin: p.vin,
    make: p.make,
    model: p.model,
    year: p.year ?? null,
    owner_name: p.ownerName ?? null,
    color: p.color ?? null,
    type: p.type ?? null,
    weight: p.weight ?? null,
    vehicle_condition: p.condition ?? null,
    vehicle_observation: p.observation ?? null,
    origin_country: p.originCountry ?? null,
    ship_location: p.shipLocation ?? null,
    is_primed: p.isPrimed ?? null,
    discharge_id: p.dischargeId ?? null,
  } as const;
}

export async function createVehicle(payload: UpsertVehiclePayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/vehicles`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toSnakePayload(payload)),
  });
  if (!res.ok) {
    let message = "Erreur lors de la création du véhicule";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function updateVehicle(id: string | number, payload: UpsertVehiclePayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/vehicles/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toSnakePayload(payload)),
  });
  if (!res.ok) {
    let message = "Erreur lors de la mise à jour du véhicule";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function deleteVehicle(id: string | number) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/vehicles/${id}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let message = "Erreur lors de la suppression du véhicule";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return true;
}
