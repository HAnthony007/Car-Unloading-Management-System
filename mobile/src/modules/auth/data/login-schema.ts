import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email({ message: "Addresse email invalide" })
        .min(1, { message: "L'email est requis" }),
    password: z
        .string()
        .min(1, { message: "Le mot de passe est requis" })
        .min(6, {
            message: "Le mot de passe doit contenir au moins 6 caractères",
        }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
    email: "",
    password: "",
};
