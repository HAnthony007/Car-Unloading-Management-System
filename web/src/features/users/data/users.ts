"use client";

import type { User } from "./schema";
import { userSchemaList } from "./schema";

type UnknownRecord = Record<string, unknown>;
function isRecord(v: unknown): v is UnknownRecord {
  return typeof v === "object" && v !== null;
}
export function normalizeUser(input: unknown): Partial<User> & { id?: string } {
  const src = isRecord(input) ? input : ({} as UnknownRecord);
  const idRaw =
    (src.user_id as string | number | undefined) ??
    (src.id as string | number | undefined) ??
    (src._id as string | number | undefined) ??
    (src.uuid as string | number | undefined);
  const id = idRaw != null ? String(idRaw) : undefined;
  const email = (src.email as string) ?? (src.mail as string) ?? "";
  let roleName: string | undefined;
  if (typeof src.role === "string") roleName = src.role as string;
  else if (isRecord(src.role))
    roleName =
      (src.role.role_name as string) ||
      (src.role.display_name as string) ||
      (src.role.name as string);
  else roleName = (src.userRole as string) ?? undefined;
  const role = (roleName === "admin" ? "admin" : "user") as User["role"];
  const fullName =
    ((src.display_name as string) ??
      (src.fullName as string) ??
      (src.full_name as string) ??
      [src.first_name as string, src.last_name as string]
        .filter(Boolean)
        .join(" ")) ||
    "";
  const phone =
    (src.phone as string) ??
    (src.phoneNumber as string) ??
    (src.telephone as string) ??
    "";
  const matriculationNumber =
    (src.matriculationNumber as string) ??
    (src.matriculation_number as string) ??
    (isRecord(src.matriculation_info)
      ? (src.matriculation_info.prefix as string) ||
        [
          src.matriculation_info.prefix as string,
          src.matriculation_info.sequence as string,
        ]
          .filter(Boolean)
          .join("-")
      : undefined) ??
    (src.matricule as string) ??
    (src.employeeId as string) ??
    "";
  let avatarUrl =
    (src.avatarUrl as string) ??
    (src.photoUrl as string) ??
    (src.image as string) ??
    "";
  if (!avatarUrl && isRecord(src.avatar)) {
    avatarUrl = (src.avatar.url as string) || (src.avatar.path as string) || "";
  }
  return {
    id,
    email,
    role,
    fullName,
    phone,
    matriculationNumber,
    avatarUrl,
  } as Partial<User> & { id?: string };
}

export function parseUsers(payload: unknown): User[] {
  const rawList: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.data)
      ? payload.data
      : isRecord(payload) && Array.isArray(payload.users)
        ? payload.users
        : [];

  const normalized = rawList.map(normalizeUser);
  const parsed = userSchemaList.safeParse(normalized);
  if (parsed.success) return parsed.data;

  console.warn("/api/users: invalid user payload", parsed.error.flatten());
  return [];
}

export type UsersMeta = {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
};

export type UsersResponse = { data: User[]; meta: UsersMeta };

export function parseUsersResponse(payload: unknown): UsersResponse {
  const data = parseUsers(payload);
  let meta: UsersMeta = {
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
