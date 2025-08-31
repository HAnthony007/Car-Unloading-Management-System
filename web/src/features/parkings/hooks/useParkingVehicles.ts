"use client";

import { useQuery } from "@tanstack/react-query";
import { getParkingVehicles } from "../lib/parkings";

export function useParkingVehicles(id: string | null) {
  return useQuery({
    queryKey: ["parking-vehicles", id],
    queryFn: () => {
      if (!id) throw new Error("Parking id is required");
      return getParkingVehicles(id);
    },
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}
