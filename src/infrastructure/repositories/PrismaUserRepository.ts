import { RehydrateUserDto } from "../../aplication/dtos/user";
import { UserRepository } from "../../aplication/ports/UserRepository";
import { User } from "../../domain/entities/User"; // ✅ Corregido el path
import { prismaClient } from "../db/prisma";

export class PrismaUserRepository implements UserRepository {
    async save(user: User): Promise<User> {
        const row = await prismaClient.user.create({
            data: {
                id: user.id.toString(),
                name: user.name,
                email: user.email.toString(),
                passwordHash: user.passwordHash,
                role: user.role
            }
        });

        return User.rehydrate(row as RehydrateUserDto);
    }

    async findById(id: string): Promise<User | null> {
        const row = await prismaClient.user.findUnique({
            where: { id }
        });

        return row ? User.rehydrate(row as RehydrateUserDto) : null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const row = await prismaClient.user.findUnique({
            where: { email }
        });

        return row ? User.rehydrate(row as RehydrateUserDto) : null;
    }
}