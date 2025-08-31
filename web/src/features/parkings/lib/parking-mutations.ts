import { fetchWithCsrf } from "@/lib/http";

export type UpdateParkingPayload = {
  name: string;
  location: string;
  capacity: number;
  number?: string | null;
};

function toSnakePayload(p: UpdateParkingPayload) {
  return {
    parking_name: p.name,
    location: p.location,
    capacity: p.capacity,
    parking_number: p.number ?? null,
  } as const;
}

export async function updateParking(id: string | number, payload: UpdateParkingPayload) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/parkings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(toSnakePayload(payload)),
  });
  if (!res.ok) {
    let message = "Erreur lors de la mise à jour du parking";
    try {
      const p = await res.json();
      message = p?.message || p?.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}
