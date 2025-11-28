import { V4 } from "paseto";
import { createPrivateKey, createPublicKey, KeyObject } from "crypto";
import { loadEnv } from "../../config/env.config";

type Role = "ADMIN" | "USER";
export type PasetoPayload = { sub: string; email: string; role: Role };

export class PasetoService {
    private publicKey: KeyObject;
    private privateKey: KeyObject;

    constructor() {
        const env = loadEnv();

        try {
            // Decodificar las claves desde base64url a Buffer
            const publicKeyBuffer = Buffer.from(env.PASETO_PUBLIC_KEY, "base64url");
            const privateKeyBuffer = Buffer.from(env.PASETO_PRIVATE_KEY, "base64url");

            // Crear KeyObjects desde los buffers
            this.publicKey = createPublicKey({
                key: publicKeyBuffer,
                format: 'der',
                type: 'spki'
            });

            this.privateKey = createPrivateKey({
                key: privateKeyBuffer,
                format: 'der',
                type: 'pkcs8'
            });
        } catch (error) {
            throw new Error(`Failed to load PASETO keys: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
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