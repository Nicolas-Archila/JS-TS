import { User } from "../../domain/entities/User"; // ✅ Corregido el path
import { Password } from "../../infrastructure/security/Password";
import { RegisterInput, RegisterSchema } from "../dtos/auth";
import { Clock } from "../ports/Clock";
import { EventBus } from "../ports/EventBus";
import { UserRepository } from "../ports/UserRepository";

export class RegisterUser {
    constructor(
        private readonly repo: UserRepository,
        private readonly clock: Clock,
        private readonly bus: EventBus
    ) {}

    async execute(input: RegisterInput): Promise<User> {
        const data = RegisterSchema.parse(input);
        const exists = await this.repo.findByEmail(data.email);

        if (exists) {
            throw Object.assign(new Error("Email already in use"), { statusCode: 409 });
        }

        const passwordHash = await Password.hash(data.password);

        const user = await this.repo.save(
            User.create(
                data,
                passwordHash,
                this.clock.now()
            )
        );

        const events = user.pullDomainEvents();
        await this.bus.publishAll(events);

        return user;
    }
}