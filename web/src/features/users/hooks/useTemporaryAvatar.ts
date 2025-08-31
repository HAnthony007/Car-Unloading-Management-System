"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemporaryAvatarUrl } from "../lib/avatars";

export function useTemporaryAvatar(userId?: string | number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["user", userId, "avatar", "temporary"],
    queryFn: () => getTemporaryAvatarUrl(userId as string | number),
    enabled: Boolean(userId) && enabled,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: false,
    select: (data) => data ?? null,
  });
}
