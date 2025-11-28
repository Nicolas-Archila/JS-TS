import { User } from "../../domain/entities/User"; // ✅ Corregido el path

export const toHttp = (user: User): {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: Date;
} => ({
    id: user.id,
    name: user.name,
    email: user.email.toString(),
    role: user.role,
    createdAt: user.createdAt
});