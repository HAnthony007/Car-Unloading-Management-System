"use client";

import { useQuery } from "@tanstack/react-query";
import { type GetVesselsParams, getVessels } from "../lib/vessels";

export function useVessels(params: GetVesselsParams = {}) {
  return useQuery({
    queryKey: ["vessels", params],
    queryFn: () => getVessels(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
