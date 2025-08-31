"use client";

import { useQueryClient } from "@tanstack/react-query";

export function useInvalidateUsers() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: ["users"] });
}
