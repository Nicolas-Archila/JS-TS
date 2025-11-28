import { Password } from "../src/infrastructure/security/Password";

async function main() {
    const pass = await Password.hash("admin123");
    console.log(pass);
}

main();
