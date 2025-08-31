import { fetchWithCsrf } from "@/lib/http";

export async function getTemporaryAvatarUrl(userId: string | number) {
  const base = process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL;
  if (!base) throw new Error("Backend base URL not configured");
  const res = await fetchWithCsrf(`${base}/users/${userId}/avatar?temporary=1`, {
    method: "GET",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error("Failed to fetch temporary avatar URL");
  }
  const json = await res.json();
  const url: unknown = json?.data?.url;
  if (typeof url !== "string" || url.length === 0) return null;
  return url as string;
}
