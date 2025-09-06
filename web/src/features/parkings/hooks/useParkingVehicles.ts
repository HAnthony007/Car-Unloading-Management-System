"use client";

import { useQuery } from "@tanstack/react-query";
import { getParkingDischarges } from "../lib/parkings";

export function useParkingDischarges(id: string | null) {
  return useQuery({
    queryKey: ["parking-discharges", id],
    queryFn: () => {
      if (!id) throw new Error("Parking id is required");
      return getParkingDischarges(id);
    },
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchOnWindowFocus: false,
  });
}
