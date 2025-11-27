import { generateKeyPairSync } from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const envName = (process.argv[2] ?? "development").toLowerCase();

const fileMap: Record<string, string> = {
    development: ".env",
    test: ".test.env",
    production: ".production.env"
};

const target = fileMap[envName];

if (!target) {
    console.error("Use: tsx scripts/gen-ed25519-keys.ts [development|test|production]");
    process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync("ed25519");

const pubDer = publicKey.export({ format: "der", type: "spki" }) as Buffer;
const privDer = privateKey.export({ format: "der", type: "pkcs8" }) as Buffer;

const pub = pubDer.toString("base64url").trim();
const priv = privDer.toString("base64url").trim();

const file = path.resolve(process.cwd(), target);
const env = fs.existsSync(file) ? fs.readFileSync(file, "utf-8") : "";

function upsert(lineName: string, value: string, src: string) {
    const re = new RegExp(`^${lineName}=.*$`, "m");
    return re.test(src)
        ? src.replace(re, `${lineName}=${value}`)
        : (src + `\n${lineName}=${value}`);
}

let next = env.trim();
next = upsert("PASETO_PUBLIC_KEY", pub, next);
next = upsert("PASETO_PRIVATE_KEY", priv, next);

fs.writeFileSync(file, next + "\n", { encoding: "utf8", mode: 0o600 });
console.log(`✔ PASETO keys written to ${target}`);