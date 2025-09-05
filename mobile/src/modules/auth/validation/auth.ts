import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, "L'email est requis")
    .email('Email invalide'),
  password: z.string()
    .min(1, 'Le mot de passe est requis')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export const loginDefaultValues: LoginFormValues = {
  email: '',
  password: '',
};
