import { V4 } from "paseto";
import { loadEnv } from "../../config/env.config";

type Role = "ADMIN" | "USER";
export type PasetoPayload = { sub: string; email: string; role: Role };

export class PasetoService {
    private publicKey: Buffer;
    private privateKey: Buffer;

    constructor() {
        const env = loadEnv();

        this.publicKey = Buffer.from(env.PASETO_PUBLIC_KEY, "base64url");
        this.privateKey = Buffer.from(env.PASETO_PRIVATE_KEY, "base64url");
    }

    async sign(payload: PasetoPayload): Promise<string> {
        const env = loadEnv();
        return await V4.sign(
            payload,
            this.privateKey,
            {
                issuer: env.TOKEN_ISSUER,
                audience: env.TOKEN_AUDIENCE,
                expiresIn: env.TOKEN_EXPIRES_IN?.toString(),
            }
        );
    }

    async verify<T = PasetoPayload>(token: string): Promise<T> {
        const env = loadEnv();
        return await V4.verify(
            token,
            this.publicKey,
            {
                issuer: env.TOKEN_ISSUER,
                audience: env.TOKEN_AUDIENCE,
            }
        ) as T;
    }
}
