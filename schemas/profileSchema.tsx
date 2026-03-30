import { z } from "zod";

export const updatedPasswordSchema = z.object({
    currentPassword: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,50}$/, "Le mot de passe est invalide")
        .max(50, "Le mot de passe ne doit pas dépasser 50 caractères"),
    newPassword: z
        .string()
        .min(8, "Le mot de passe doit faire au moins 8 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,50}$/, "Le mot de passe est invalide")
        .max(50, "Le mot de passe ne doit pas dépasser 50 caractères"),
    confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmNewPassword"],
});

export type UpdatedPasswordInput = z.infer<typeof updatedPasswordSchema>;
