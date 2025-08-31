"use client";

import type { Parking } from "./schema";
import { parkingSchemaList } from "./schema";

type UnknownRecord = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

export function normalizeParking(input: unknown): Partial<Parking> & { id?: string } {
  const src = isRecord(input) ? input : ({} as UnknownRecord);
  const idRaw =
    (src.parking_id as string | number | undefined) ??
    (src.id as string | number | undefined) ??
    (src._id as string | number | undefined);
  const id = idRaw != null ? String(idRaw) : undefined;
  const name = (src.parking_name as string) ?? (src.name as string) ?? "";
  const location = (src.location as string) ?? "";
  const capacityNum = (src.capacity as number | string | undefined) ?? 0;
  const capacity = Number(capacityNum) || 0;
  const number = (src.parking_number as string) ?? (src.number as string) ?? "";
  const createdAt = (src.created_at as string) ?? (src.createdAt as string) ?? "";
  const updatedAt = (src.updated_at as string) ?? (src.updatedAt as string) ?? "";
  return { id, name, location, capacity, number, createdAt, updatedAt } as Partial<Parking> & { id?: string };
}

export function parseParkings(payload: unknown): Parking[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : [];

  const normalized = rawList.map(normalizeParking);
  const parsed = parkingSchemaList.safeParse(normalized);
  if (parsed.success) return parsed.data;

  console.warn("/api/parkings: invalid parking payload", parsed.error.flatten());
  return [];
}

export type ParkingsResponse = { data: Parking[] };

export function parseParkingsResponse(payload: unknown): ParkingsResponse {
  const data = parseParkings(payload);
  return { data };
}
