import { z } from "zod";

export const RoleValues = ["ADMIN", "USER"] as const;
export const ZRole = z.enum(RoleValues);

export const RegisterSchema = z.object({
    name: z.string().trim().min(2),
    email: z.email(),
    password: z.string().min(8),
    role: ZRole.optional().default("USER"),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const LoginSchema = z.object({
    email: z.email(),
    password: z.string().min(8),
});
export type LoginInput = z.infer<typeof LoginSchema>;