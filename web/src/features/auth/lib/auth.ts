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

  return response.json();
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

  return response.json();
}
