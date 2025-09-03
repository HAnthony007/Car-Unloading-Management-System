"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createUser,
    deleteUser,
    deleteUserAvatar,
    updateUser,
    uploadUserAvatar,
    type UpsertUserPayload,
} from "../lib/user-mutations";

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpsertUserPayload) => createUser(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    // payload shape is flexible (matriculation may be optional), keep it loose here
    mutationFn: ({ id, payload }: { id: string | number; payload: Partial<UpsertUserPayload> }) =>
      updateUser(id, payload as any),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUploadUserAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string | number; file: File }) => uploadUserAvatar(id, file),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUserAvatar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteUserAvatar(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: string | number }) => deleteUser(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}
