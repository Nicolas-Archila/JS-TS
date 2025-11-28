import { generateKeyPairSync } from "crypto";

function toBase64Url(str) {
  return Buffer.from(str)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

const { privateKey, publicKey } = generateKeyPairSync("ec", {
  namedCurve: "P-256",
});

// Exportamos en PEM (formato compatible)
const privatePem = privateKey.export({
  type: "pkcs8",
  format: "pem",
});

const publicPem = publicKey.export({
  type: "spki",
  format: "pem",
});

// Convertimos PEM → Base64URL limpio
const privateBase64 = toBase64Url(privatePem);
const publicBase64 = toBase64Url(publicPem);

console.log("\n==== 🔐 CLAVES GENERADAS ====\n");
console.log("PUBLIC_KEY=");
console.log(publicBase64);
console.log("\nPRIVATE_KEY=");
console.log(privateBase64);
console.log("\n==============================\n");
