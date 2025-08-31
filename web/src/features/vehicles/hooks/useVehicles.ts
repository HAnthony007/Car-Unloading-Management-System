"use client";

import { useQuery } from "@tanstack/react-query";
import { type GetVehiclesParams, getVehicles } from "../lib/vehicles";

export function useVehicles(params: GetVehiclesParams = {}) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => getVehicles(params),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
}
