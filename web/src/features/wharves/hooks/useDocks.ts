"use client";

import { useQuery } from "@tanstack/react-query";
import { getDocks } from "../lib/docks";

export function useDocks() {
  return useQuery({
    queryKey: ["docks"],
    queryFn: () => getDocks(),
    staleTime: 60_000,
  });
}
