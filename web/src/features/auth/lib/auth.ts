function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export async function login(email: string, password: string) {
  await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/sanctum/csrf-cookie`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/spa/login`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    throw new Error("Login failed");
  }

  return response.json();
}

export async function getMe() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/me`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}

export async function logout() {
  await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/sanctum/csrf-cookie`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      credentials: "include",
    },
  );

  const xsrfToken = getCookie("XSRF-TOKEN");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/auth/spa/logout`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      },
      credentials: "include",
    },
  );

  if (!response.ok) {
    throw new Error("Logout failed");
  }

  return response.json();
}
