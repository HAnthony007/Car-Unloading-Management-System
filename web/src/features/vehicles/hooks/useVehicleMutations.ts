"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createVehicle, deleteVehicle, updateVehicle, type UpsertVehiclePayload } from "../lib/vehicle-mutations";

export function useCreateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertVehiclePayload) => createVehicle(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string | number; payload: UpsertVehiclePayload }) => updateVehicle(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}

export function useDeleteVehicle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteVehicle(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["vehicles"] }),
  });
}
