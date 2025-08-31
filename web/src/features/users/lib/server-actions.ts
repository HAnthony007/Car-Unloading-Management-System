"use server";

export async function uploadUserAvatarAction(
  backendBaseUrl: string | undefined,
  userId: string | number,
  file: File,
) {
  if (!backendBaseUrl) throw new Error("Backend base URL not configured");
  const url = new URL(`${backendBaseUrl}/users/${userId}/avatar`);
  const fd = new FormData();
  fd.append("avatar", file);
  const res = await fetch(url.toString(), {
    method: "POST",
    body: fd,
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    // Try to extract error message
    let message = "Erreur lors de l’upload de l’avatar";
    try {
      const payload = await res.json();
      if (payload?.error) message = String(payload.error);
    } catch {}
    throw new Error(message);
  }
  return true;
}

export async function deleteUserAvatarAction(
  backendBaseUrl: string | undefined,
  userId: string | number,
) {
  if (!backendBaseUrl) throw new Error("Backend base URL not configured");
  const url = new URL(`${backendBaseUrl}/users/${userId}/avatar`);
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: { Accept: "application/json" },
    credentials: "include",
  });
  if (!res.ok) {
    let message = "Erreur lors de la suppression de l’avatar";
    try {
      const payload = await res.json();
      if (payload?.error) message = String(payload.error);
    } catch {}
    throw new Error(message);
  }
  return true;
}

type UpsertUserPayload = {
  fullName: string;
  email: string;
  matriculationNumber: string;
  phone?: string | null;
  role: "admin" | "user";
  password?: string; // only for create
};

function mapRoleNameToId(role: UpsertUserPayload["role" ]): number {
  // Adjust if your DB has different IDs
  return role === "admin" ? 1 : 2;
}

export async function createUserAction(
  backendBaseUrl: string | undefined,
  payload: UpsertUserPayload,
) {
  if (!backendBaseUrl) throw new Error("Backend base URL not configured");
  const url = new URL(`${backendBaseUrl}/users`);
  const body = {
    matriculation_no: payload.matriculationNumber,
    full_name: payload.fullName,
    email: payload.email,
    password: payload.password ?? "password12345", // fallback for demo; replace as needed
    password_confirmation: payload.password ?? "password12345",
    avatar: null,
    phone: payload.phone ?? null,
    role_id: mapRoleNameToId(payload.role),
  };
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = "Erreur lors de la création";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export async function updateUserAction(
  backendBaseUrl: string | undefined,
  userId: string | number,
  payload: Omit<UpsertUserPayload, "password">,
) {
  if (!backendBaseUrl) throw new Error("Backend base URL not configured");
  const url = new URL(`${backendBaseUrl}/users/${userId}`);
  const body = {
    full_name: payload.fullName,
    phone: payload.phone ?? null,
    role_id: mapRoleNameToId(payload.role),
  };
  const res = await fetch(url.toString(), {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    let message = "Erreur lors de la mise à jour";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

