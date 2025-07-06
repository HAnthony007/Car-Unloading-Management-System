function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift();
}

export async function login(email: string, password: string) {
    await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/csrf-cookie`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                // Origin: "localhost:3000",
            },
            credentials: "include",
        }
    );

    const xsrfToken = getCookie("XSRF-TOKEN");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(xsrfToken
                    ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) }
                    : {}),
            },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        }
    );

    if (!response.ok) throw new Error("Failed to login");

    return response.json();
}

export async function getUser() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/user`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
            },
            credentials: "include",
        }
    );

    if (!response.ok) throw new Error("User not authenticated");

    return response.json();
}

export async function logout() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Origin: "localhost",
            },
            credentials: "include",
        }
    );

    if (!response.ok) throw new Error("Failed to logout");

    return response.json();
}
