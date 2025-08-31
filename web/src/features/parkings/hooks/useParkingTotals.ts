"use client";

import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { getParkingVehicles } from "../lib/parkings";

export function useParkingTotals(ids: string[]) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["parking-vehicles-count", id],
      queryFn: async () => {
        const d = await getParkingVehicles(id);
        return d.total;
      },
      enabled: Boolean(id),
      staleTime: 15_000,
      refetchOnWindowFocus: false,
    })),
    combine: (results) => {
      const isLoading = results.some((r) => r.isLoading);
      const isError = results.some((r) => r.isError);
      const data = results.map((r) => r.data as number | undefined);
      return { isLoading, isError, data };
    },
  });

  const totalsById = useMemo(() => {
    const map: Record<string, number> = {};
    ids.forEach((id, idx) => {
      const v = queries.data?.[idx];
      if (typeof v === "number" && Number.isFinite(v)) map[id] = v;
    });
    return map;
  }, [ids, queries.data]);

  return {
    totalsById,
    isLoading: queries.isLoading,
    isError: queries.isError,
  };
}
