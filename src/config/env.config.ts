import { z } from "zod";

const envSchema = z.object({
    PORT: z.coerce.number().default(3333),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    JWT_SECRET: z.string().min(8),

    DB_DATABASE: z.string(),
    DB_USER: z.string(),
    DB_PASSWORD: z.string().min(6),
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().default(5432),

    PGADMIN_DEFAULT_EMAIL: z.string().email(),
    PGADMIN_DEFAULT_PASSWORD: z.string().min(8),

    DATABASE_URL: z.string().url(),

    PASETO_PUBLIC_KEY: z.string().min(10).regex(/^[A-Za-z0-9_-]+$/),
    PASETO_PRIVATE_KEY: z.string().min(10).regex(/^[A-Za-z0-9_-]+$/),
    TOKEN_ISSUER: z.string().default("hospital.desk.api"),
    TOKEN_AUDIENCE: z.string().default("hospital.desk.clients"),
    TOKEN_EXPIRES_IN: z.union([z.string(), z.number()]).default("2h"),
});

export type EnvVariables = z.infer<typeof envSchema>;

export function loadEnv(): EnvVariables {
    return envSchema.parse(process.env);
}