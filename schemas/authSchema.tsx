import { z } from "zod";

// Schéma Zod pour validation
const loginUserBodySchema = z.object({
    email: z
        .string()
        .email("L'email est invalide")
        .max(50, "L'email ne doit pas dépasser 50 caractères"),
    password: z.string().min(1, "Le mot de passe est obligatoire"),
});

export default loginUserBodySchema;