"use client";

import { useQuery } from "@tanstack/react-query";
import { getParkings } from "../lib/parkings";

export function useParkings() {
  return useQuery({
    queryKey: ["parkings"],
    queryFn: () => getParkings(),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
