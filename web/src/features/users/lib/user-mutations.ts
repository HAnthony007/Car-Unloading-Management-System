import { fetchWithCsrf } from "@/lib/http";
export type RoleName = "admin" | "agent";

export type UpsertUserPayload = {
  fullName: string;
  email: string;
  matriculationNumber: string;
  phone?: string | null;
  role: RoleName;
  password?: string; // create only
};

function mapRoleNameToId(role: RoleName): number {
  return role === "admin" ? 1 : 2;
}

export async function createUser(payload: UpsertUserPayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      matriculation_no: payload.matriculationNumber,
      full_name: payload.fullName,
      email: payload.email,
      password: payload.password ?? "password12345",
      password_confirmation: payload.password ?? "password12345",
      phone: payload.phone ?? null,
      role_id: mapRoleNameToId(payload.role),
    }),
  });
  if (!res.ok) {
  let parsed: any = null;
  try { parsed = await res.json(); } catch {}
  const message = parsed?.message || parsed?.error || "Erreur lors de la création";
  const err: any = new Error(message);
  if (parsed) err.response = parsed;
  throw err;
  }
  return res.json();
}

export async function updateUser(userId: string | number, payload: Omit<UpsertUserPayload, "password" | "email" | "matriculationNumber"> & { email?: string; matriculationNumber?: string }) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/users/${userId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      full_name: payload.fullName,
  ...(payload.email ? { email: payload.email } : {}),
      phone: payload.phone ?? null,
      role_id: mapRoleNameToId(payload.role),
    }),
  });
  if (!res.ok) {
  let parsed: any = null;
  try { parsed = await res.json(); } catch {}
  const message = parsed?.message || parsed?.error || "Erreur lors de la mise à jour";
  const err: any = new Error(message);
  if (parsed) err.response = parsed;
  throw err;
  }
  return res.json();
}

export async function uploadUserAvatar(userId: string | number, file: File) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const fd = new FormData();
  fd.append("avatar", file);
  const res = await fetchWithCsrf(`${base}/users/${userId}/avatar`, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: fd,
  });
  if (!res.ok) {
    let message = "Erreur lors de l’upload de l’avatar";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return true;
}

export async function deleteUserAvatar(userId: string | number) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/users/${userId}/avatar`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let message = "Erreur lors de la suppression de l’avatar";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return true;
}

export async function deleteUser(userId: string | number) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/users/${userId}`, {
    method: "DELETE",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    let message = "Erreur lors de la suppression de l'utilisateur";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return true;
}
