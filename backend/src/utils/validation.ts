import { z } from 'zod';

export const registerSchema = z.object({
    email: z.union([z.string().email(), z.literal('')]).optional(),
    // Allow +228 followed by 8 digits, ignoring spaces in between
    phoneNumber: z.string()
        .transform(val => val.replace(/\s/g, ''))
        .pipe(z.union([z.string().regex(/^\+228\d{8}$/, "Format invalide: +228 90 90 90 90"), z.literal('')]))
        .optional(),
    password: z.string().min(6),
    name: z.string().optional(),
    role: z.enum(['USER', 'ORGANIZER']).optional(),
}).refine((data) => {
    if (data.role === 'ORGANIZER' && !data.email) return false;
    if (data.role === 'USER' && !data.phoneNumber) return false;
    return true;
}, {
    message: "L'email est requis pour les organisateurs, le numéro de téléphone pour les spectateurs.",
    path: ["email", "phoneNumber"],
});

export const loginSchema = z.object({
    identifier: z.string(), // Can be email or phone number
    password: z.string(),
});
