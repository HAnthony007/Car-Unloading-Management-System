import type { Vehicle } from "@/features/vehicles/data/schema";
import { vehicleSchemaList } from "@/features/vehicles/data/schema";
import { fetchWithCsrf } from "@/lib/http";
import { parseParkingsResponse } from "../data/parkings";

export async function getParkings() {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const url = new URL(`${base}/parkings`);

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch parkings");
  const payload = await res.json();
  return parseParkingsResponse(payload);
}

export type ParkingVehicles = {
  parkingId: string;
  parkingName: string;
  total: number;
  vehicles: (Vehicle & { parkingNumber?: string })[];
};

export async function getParkingVehicles(id: string): Promise<ParkingVehicles> {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const url = new URL(`${base}/parkings/${id}/vehicles`);

  const res = await fetchWithCsrf(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch parking vehicles");
  const payload = await res.json();

  // Normalize vehicle list using existing schema; map snake_case -> camelCase is handled in vehicles/data/vehicles if needed,
  // but here we only validate/reshape minimally.
  const listRaw = Array.isArray(payload?.vehicles) ? payload.vehicles : [];
  // Map vehicles into Vehicle shape keys; reuse schema for validation
  const mapped = listRaw.map((v: any) => ({
    id: String(v.vehicle_id ?? v.id ?? ""),
    vin: v.vin ?? "",
    make: v.make ?? "",
    model: v.model ?? "",
    year: v.year ?? "",
    ownerName: v.owner_name ?? v.ownerName ?? "",
    color: v.color ?? "",
    type: v.type ?? "",
    weight: v.weight ?? "",
    condition: v.vehicle_condition ?? v.condition ?? "",
    observation: v.vehicle_observation ?? v.observation ?? "",
    originCountry: v.origin_country ?? v.originCountry ?? "",
    shipLocation: v.ship_location ?? v.shipLocation ?? "",
    isPrimed: Boolean(v.is_primed ?? v.isPrimed ?? false),
    dischargeId: v.discharge_id ?? v.dischargeId ?? undefined,
    createdAt: v.created_at ?? v.createdAt ?? "",
    updatedAt: v.updated_at ?? v.updatedAt ?? "",
    // extra
    parkingNumber: v.parking_number ?? v.parkingNumber ?? undefined,
  }));
  const parsed = vehicleSchemaList.safeParse(mapped);
  const vehicles = (parsed.success ? parsed.data : (mapped as unknown as Vehicle[]));
  if (!parsed.success) {
    // Optional diagnostics to help trace mismatches without breaking UI
    console.warn("/api/parkings/:id/vehicles: invalid vehicle payload", parsed.error?.flatten?.());
  }

  return {
    parkingId: String(payload?.parking_id ?? ""),
    parkingName: String(payload?.parking_name ?? ""),
    total: Number(payload?.total ?? vehicles.length) || vehicles.length,
    vehicles: vehicles.map((v, i) => ({ ...v, parkingNumber: mapped[i]?.parkingNumber })),
  };
}
