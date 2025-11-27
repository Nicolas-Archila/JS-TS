import { z } from "zod";
import { ZRole } from "./auth";

export const RehydrateUserSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    passwordHash: z.string(),
    role: ZRole,
});

export type RehydrateUserDto = z.infer<typeof RehydrateUserSchema>;