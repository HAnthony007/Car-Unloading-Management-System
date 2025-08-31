"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVessel, updateVessel, type UpsertVesselPayload } from "../lib/vessel-mutations";

export function useCreateVessel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertVesselPayload) => createVessel(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vessels"] }),
  });
}

export function useUpdateVessel() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpsertVesselPayload }) =>
      updateVessel(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vessels"] }),
  });
}
