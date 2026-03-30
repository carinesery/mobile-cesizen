import { z } from "zod";

// Schéma Zod pour validation
const loginUserBodySchema = z.object({
    email: z
        .string()
        .regex(
            /^[^@]+@[^@]+\.[^@]+$/,
            "L'email est invalide"
        )
        .max(50, "L'email ne doit pas dépasser 50 caractères"),
    password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export default loginUserBodySchema;


export const registerUserBodySchema = z.object({
    username: z
        .string()
        .min(3, "Le nom d'utilisateur doit faire au moins 3 caractères")
        .max(50, "Le nom d'utilisateur ne doit pas dépasser 50 caractères"),
    email: z
        .string()
        .regex(
            /^[^@]+@[^@]+\.[^@]+$/,
            "L'email est invalide"
        )
        .max(255, "L'email ne doit pas dépasser 255 caractères"),
    password: z
        .string()
        .min(8, "Le mot de passe doit contenir au moins 8 caractères")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9\s]).{8,50}$/, "Le mot de passe est invalide")
        .max(50, "Le mot de passe ne doit pas dépasser 50 caractères"),
    confirmPassword: z.string(),
    termsConsent: z.preprocess((val) => val === "true" || val === true, z.literal(true, {
        message: "Vous devez accepter les conditions d'utilisation"
    })
    ),
    privacyConsent: z.preprocess((val) => val === "true" || val === true, z.literal(true, {
        message: "Vous devez accepter la politique de confidentialité"
    })
    ),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
});
