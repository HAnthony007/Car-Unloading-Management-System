import { parseUsersResponse } from "../data/users";
export type GetUsersParams = {
  page?: number;
  perPage?: number;
  q?: string;
  role?: string; // backward compat
  roles?: string[]; // multi-role filtering
};

export async function getUsers(params: GetUsersParams = {}) {
  const url = new URL(`${process.env.NEXT_PUBLIC_BACKEND_API_BASE_URL}/users`);
  const search = new URLSearchParams();
  // Pagination (Laravel expects: page, per_page)
  if (params.page) search.set("page", String(params.page));
  if (params.perPage) search.set("per_page", String(params.perPage));

  // Text search (Laravel expects: search_term)
  if (params.q && params.q.trim() !== "") {
    search.set("search_term", params.q.trim());
  }

  // Role filter(s) by role name: backend accepts 'roles[]' or 'role'
  if (params.roles && params.roles.length > 0) {
    params.roles.forEach((name) => search.append("roles[]", name));
  } else if (params.role) {
    search.set("role", params.role);
  }
  url.search = search.toString();

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  const payload = await res.json();
  return parseUsersResponse(payload);
}
