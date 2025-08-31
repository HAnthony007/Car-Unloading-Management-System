"use client";

import { useQuery } from "@tanstack/react-query";
import { type GetUsersParams, getUsers } from "../lib/users";

export function useUsers(params: GetUsersParams = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
