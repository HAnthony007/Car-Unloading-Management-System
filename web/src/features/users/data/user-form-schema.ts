import { z } from "zod";
import { ACCEPTED_IMAGE_TYPES, MAX_AVATAR_MB } from "../lib/constants";

export const userFormSchema = z.object({
  fullName: z
    .string()
    .min(2, { message: "Le nom complet est requis" })
    .max(120, { message: "Le nom est trop long" }),
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .min(1, "Email is required"),
  matriculationNumber: z
    .string()
    .min(1, { message: "Le matricule est requis" })
    .max(30, { message: "Le matricule est trop long" }),
  phone: z
    .string()
    .optional()
    .refine((v) => !v || v.length >= 6, {
      message: "Numéro invalide",
    }),
  avatar: z
    .any()
    .refine(
      (file) => file == null || file instanceof File,
      "Fichier invalide",
    )
    .refine(
      (file) => !file || file.size <= MAX_AVATAR_MB * 1024 * 1024,
      `L'image doit être ≤ ${MAX_AVATAR_MB}MB`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Formats acceptés: JPEG, PNG, WEBP, GIF",
    )
    .optional()
    .nullable(),
  role: z.enum(["admin", "user"], { message: "Role is required" }),
});

export type UserForm = z.infer<typeof userFormSchema>;
