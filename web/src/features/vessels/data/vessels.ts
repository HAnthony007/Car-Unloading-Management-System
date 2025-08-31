"use client";

import type { Vessel } from "./schema";
import { vesselSchemaList } from "./schema";

type UnknownRecord = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}

export function normalizeVessel(input: unknown): Partial<Vessel> & { id?: string } {
  const src = isRecord(input) ? input : ({} as UnknownRecord);
  const idRaw =
    (src.vessel_id as string | number | undefined) ??
    (src.id as string | number | undefined) ??
    (src._id as string | number | undefined);
  const id = idRaw != null ? String(idRaw) : undefined;
  const imoNo = (src.imo_no as string) ?? (src.imoNo as string) ?? "";
  const name = (src.vessel_name as string) ?? (src.name as string) ?? "";
  const flag = (src.flag as string) ?? "";
  const createdAt = (src.created_at as string) ?? (src.createdAt as string) ?? "";
  const updatedAt = (src.updated_at as string) ?? (src.updatedAt as string) ?? "";

  return {
    id,
    imoNo,
    name,
    flag,
    createdAt,
    updatedAt,
  } as Partial<Vessel> & { id?: string };
}

export function parseVessels(payload: unknown): Vessel[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && isRecord(payload.data)
        ? [payload.data]
        : [];

  const normalized = rawList.map(normalizeVessel);
  const parsed = vesselSchemaList.safeParse(normalized);
  if (parsed.success) return parsed.data;

  console.warn("/api/vessels: invalid vessel payload", parsed.error.flatten());
  return [];
}

export type VesselsMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type VesselsResponse = { data: Vessel[]; meta: VesselsMeta };

export function parseVesselsResponse(payload: unknown): VesselsResponse {
  const data = parseVessels(payload);
  let meta: VesselsMeta = {
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
