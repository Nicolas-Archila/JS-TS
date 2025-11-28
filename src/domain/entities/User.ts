import { randomUUID } from "crypto";

import { BaseEntity } from "./BaseEntity";
import { RegisterInput } from "../../aplication/dtos/auth";
import { Email } from "../values-objects/Email";
import { DomainEvent } from "../events/DomainEvent";
import { RehydrateUserDto } from "../../aplication/dtos/user";

type Role = "ADMIN" | "USER";

export class User extends BaseEntity {
    constructor(
        id: string,
        public name: string,
        public readonly email: Email,
        public readonly passwordHash: string,
        public role: Role,
        createdAt: Date = new Date()
    ) {
        super(id, createdAt);
    }

    public static create(dto: RegisterInput, passwordHash: string, now: Date): User {
        const user = new User(
            randomUUID(),
            dto.name,
            Email.parse(dto.email),
            passwordHash,
            dto.role,
            now
        );

        const event: DomainEvent = {
            type: "user.created",
            occurredAt: now,
            payload: {
                id: user.id.toString(),
                name: user.name,
                email: user.email.toString(),
                role: user.role
            },
        };

        user.recordEvent(event);

        return user;
    }

    public static rehydrate(row: RehydrateUserDto): User {
        return new User(
            row.id,
            row.name,
            Email.parse(row.email),
            row.passwordHash,
            row.role,
            new Date()
        );
    }
}