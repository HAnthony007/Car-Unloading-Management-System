"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
    createUser,
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
    mutationFn: ({ id, payload }: { id: string | number; payload: Omit<UpsertUserPayload, "password"> }) =>
      updateUser(id, payload),
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
