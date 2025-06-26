import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().trim(),
        email: z.string().email({ message: "Invalid email" }).trim(),
        password: z
            .string()
            .min(8, { message: "Password should be at least 8 characters" })
            .trim(),
        confirmPassword: z.string().trim(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export type registerSchemaType = z.infer<typeof registerSchema>;
