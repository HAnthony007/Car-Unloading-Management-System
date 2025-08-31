import { ensureCsrfCookie, xsrfHeader } from "./csrf";

export async function fetchWithCsrf(
  input: RequestInfo | URL,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers || {});
  // Merge XSRF header always
  const xsrf = xsrfHeader();
  for (const [k, v] of Object.entries(xsrf)) headers.set(k, v);
  headers.set("Accept", headers.get("Accept") || "application/json");

  const attempt = async () =>
    fetch(input, {
      ...init,
      credentials: "include",
      headers,
    });

  let res = await attempt();
  if (res.status === 419) {
    // Token invalid/expired: refresh and retry once
    await ensureCsrfCookie();
    const refreshedHeaders = new Headers(init.headers || {});
    const refreshedXsrf = xsrfHeader();
    for (const [k, v] of Object.entries(refreshedXsrf)) refreshedHeaders.set(k, v);
    refreshedHeaders.set("Accept", refreshedHeaders.get("Accept") || "application/json");
    res = await fetch(input, {
      ...init,
      credentials: "include",
      headers: refreshedHeaders,
    });
  }
  return res;
}
