import { z } from "zod";

const userRoleSchema = z.union([z.literal("admin"), z.literal("agent")]);

const userSchema = z.object({
  id: z.string(),
  matriculationNumber: z
    .string()
    .min(1, "Matriculation required")
    .optional()
    .or(z.literal("")),
  fullName: z
    .string()
    .min(1, "Full name required")
    .optional()
    .or(z.literal("")),
  email: z.email(),
  avatarUrl: z.string().url().optional().or(z.literal("")),
  phone: z.string().min(3).optional().or(z.literal("")),
  role: userRoleSchema,
});

export type User = z.infer<typeof userSchema>;

export const userSchemaList = z.array(userSchema);
