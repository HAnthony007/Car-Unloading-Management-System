import { z } from "zod";

const userRoleSchema = z.union([z.literal("admin"), z.literal("user")]);

const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  role: userRoleSchema,
});

export type User = z.infer<typeof userSchema>;

export const userSchemaList = z.array(userSchema);
