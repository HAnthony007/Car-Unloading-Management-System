export async function login(email: string, password: string) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
        }
    );

    if (!response.ok) throw new Error("Failed to login");

    const data = await response.json();
    console.log(data);
    if (data.data.token) {
        localStorage.setItem("auth_token", data.data.token);
    }
    return data;
}

export async function getUser() {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No auth token found");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/user`,
        {
            method: "GET",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) throw new Error("User not authenticated");

    return response.json();
}

export async function logout() {
    const token = localStorage.getItem("auth_token");
    if (!token) throw new Error("No auth token found");

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/api/logout`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) throw new Error("Failed to logout");

    // Remove token from localStorage on logout
    localStorage.removeItem("auth_token");

    return response.json();
}
