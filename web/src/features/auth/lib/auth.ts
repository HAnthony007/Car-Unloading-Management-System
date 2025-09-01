import { ensureCsrfCookie } from "@/lib/csrf";
import { fetchWithCsrf } from "@/lib/http";

export async function login(email: string, password: string) {
  await ensureCsrfCookie();

  const response = await fetchWithCsrf(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/spa/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error("Login failed");
  }

  const data = await response.json();
  // Set a lightweight marker cookie for middleware (non-sensitive)
  try {
    if (typeof document !== "undefined") {
      document.cookie = "app_auth=1; Path=/; SameSite=Lax";
    }
  } catch {}
  return data;
}

export async function getMe() {
  const response = await fetchWithCsrf(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    // Let client redirect run; keep query calm
    if ([401, 419, 204].includes(response.status)) return null;
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function logout() {
  const response = await fetchWithCsrf(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/spa/logout`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  // Unset marker cookie for middleware
  try {
    if (typeof document !== "undefined") {
      // Set expiration in the past to delete
      document.cookie = "app_auth=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
  } catch {}
  if (response.status === 204) return { success: true } as const;
  return response.json();
}
