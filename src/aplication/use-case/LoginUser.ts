import { PasetoService } from "../../infrastructure/security/PasetoService";
import { Password } from "../../infrastructure/security/Password";
import { LoginSchema } from "../dtos/auth";
import { UserRepository } from "../ports/UserRepository";

export class LoginUser {
    constructor(
        private readonly repo: UserRepository,
        private readonly paseto: PasetoService
    ) {}

    async execute(input: unknown): Promise<{
        access_token: string;
        token_type: string;
        expires_in: number;
    }> {
        const data = LoginSchema.parse(input);
        const user = await this.repo.findByEmail(data.email);

        if (!user) {
            throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
        }

        const ok = await Password.compare(data.password, user.passwordHash);

        if (!ok) {
            throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
        }

        const token = await this.paseto.sign({
            sub: user.id,
            email: user.email.toString(),
            role: user.role
        });

        return {
            access_token: token,
            token_type: "Bearer",
            expires_in: 7200
        };
    }
}