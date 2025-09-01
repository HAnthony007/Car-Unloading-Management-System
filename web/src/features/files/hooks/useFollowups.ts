"use client";

import { useQuery } from "@tanstack/react-query";
import { type GetFollowupsParams, getFollowups } from "../lib/followups";

export function useFollowups(params: GetFollowupsParams = {}) {
  return useQuery({
    queryKey: ["followups", params],
    queryFn: () => getFollowups(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
