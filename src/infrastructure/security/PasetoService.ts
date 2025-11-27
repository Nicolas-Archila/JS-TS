import { V4 } from "paseto";
import { loadEnv } from "../../config/env.config";
import { createPrivateKey, createPublicKey } from "node:crypto";

type Role = "ADMIN" | "USER";
export type PasetoPayload = { sub: string; email: string; role: Role };

export class PasetoService {
    private publicKey!: any;
    private secretKey!: any;

    constructor() {
        const env = loadEnv();
        const pubRaw = Buffer.from(env.PASETO_PUBLIC_KEY, "base64url");
        const secRaw = Buffer.from(env.PASETO_PRIVATE_KEY, "base64url");

        this.publicKey = createPublicKey({ key: pubRaw, format: "der", type: "spki" });
        this.secretKey = createPrivateKey({ key: secRaw, format: "der", type: "pkcs8" });
    }

    async sign(payload: PasetoPayload): Promise<string> {
        const env = loadEnv();
        return V4.sign(
            payload as any,
            this.secretKey,
            {
                issuer: env.TOKEN_ISSUER,
                audience: env.TOKEN_AUDIENCE,
                expiresIn: env.TOKEN_EXPIRES_IN as any,
            }
        );
    }

    async verify<T = PasetoPayload>(token: string): Promise<T> {
        const env = loadEnv();
        return V4.verify(
            token,
            this.publicKey,
            {
                issuer: env.TOKEN_ISSUER,
                audience: env.TOKEN_AUDIENCE,
            }
        ) as Promise<T>;
    }
}