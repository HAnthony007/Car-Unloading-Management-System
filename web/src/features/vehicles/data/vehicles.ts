"use client";

import type { Vehicle } from "./schema";
import { vehicleSchemaList } from "./schema";

type UnknownRecord = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

export function normalizeVehicle(input: unknown): Partial<Vehicle> & { id?: string } {
  const src = isRecord(input) ? input : ({} as UnknownRecord);
  const idRaw =
    (src.vehicle_id as string | number | undefined) ??
    (src.id as string | number | undefined) ??
    (src._id as string | number | undefined);
  const id = idRaw != null ? String(idRaw) : undefined;
  const vin = (src.vin as string) ?? "";
  const make = (src.make as string) ?? "";
  const model = (src.model as string) ?? "";
  const year = (src.year as string | number | null | undefined);
  const ownerName = (src.owner_name as string) ?? (src.ownerName as string) ?? "";
  const color = (src.color as string) ?? "";
  const type = (src.type as string) ?? "";
  const weight = (src.weight as string) ?? "";
  const condition = (src.vehicle_condition as string) ?? (src.condition as string) ?? "";
  const observation = (src.vehicle_observation as string) ?? (src.observation as string) ?? "";
  const originCountry = (src.origin_country as string) ?? (src.originCountry as string) ?? "";
  const shipLocation = (src.ship_location as string | null | undefined) ?? null;
  const isPrimed = Boolean((src.is_primed as boolean | undefined) ?? false);
  const dischargeId = (src.discharge_id as number | null | undefined) ?? null;
  const createdAt = (src.created_at as string) ?? (src.createdAt as string) ?? "";
  const updatedAt = (src.updated_at as string) ?? (src.updatedAt as string) ?? "";

  return {
    id,
    vin,
    make,
    model,
    year: year != null ? String(year) : "",
    ownerName,
    color,
    type,
    weight,
    condition,
    observation,
    originCountry,
    shipLocation: shipLocation ?? "",
    isPrimed,
    dischargeId: dischargeId ?? undefined,
    createdAt,
    updatedAt,
  } as Partial<Vehicle> & { id?: string };
}

export function parseVehicles(payload: unknown): Vehicle[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && isRecord(payload.data)
        ? [payload.data]
        : [];

  const normalized = rawList.map(normalizeVehicle);
  const parsed = vehicleSchemaList.safeParse(normalized);
  if (parsed.success) return parsed.data;

  console.warn("/api/vehicles: invalid vehicle payload", parsed.error.flatten());
  return [];
}

export type VehiclesMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VehiclesResponse = { data: Vehicle[]; meta: VehiclesMeta };

export function parseVehiclesResponse(payload: unknown): VehiclesResponse {
  const data = parseVehicles(payload);
  let meta: VehiclesMeta = {
    currentPage: 1,
    lastPage: 1,
    perPage: data.length,
    total: data.length,
  };
  if (isRecord(payload) && isRecord(payload.meta)) {
    const m = payload.meta as Record<string, unknown>;
    const current = Number(m.current_page ?? 1);
    const last = Number(m.last_page ?? 1);
    const per = Number((m.per_page ?? data.length) || 10);
    const total = Number(m.total ?? data.length);
    meta = {
      currentPage: Number.isFinite(current) ? current : 1,
      lastPage: Number.isFinite(last) ? last : 1,
      perPage: Number.isFinite(per) ? per : data.length || 10,
      total: Number.isFinite(total) ? total : data.length,
    };
  }
  return { data, meta };
}
