import { describe, it, expect } from "vitest";
import { Password } from "../../src/infrastructure/security/Password";

describe("Password Service", () => {
    const plainPassword = "mySecurePassword123";

    it("should hash a password", async () => {
        const hash = await Password.hash(plainPassword);
        
        expect(hash).toBeDefined();
        expect(hash).not.toBe(plainPassword);
        expect(hash.length).toBeGreaterThan(20);
    });

    it("should verify correct password", async () => {
        const hash = await Password.hash(plainPassword);
        const isValid = await Password.compare(plainPassword, hash);
        
        expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
        const hash = await Password.hash(plainPassword);
        const isValid = await Password.compare("wrongPassword", hash);
        
        expect(isValid).toBe(false);
    });

    it("should generate different hashes for same password", async () => {
        const hash1 = await Password.hash(plainPassword);
        const hash2 = await Password.hash(plainPassword);
        
        expect(hash1).not.toBe(hash2);
        
        // But both should be valid
        expect(await Password.compare(plainPassword, hash1)).toBe(true);
        expect(await Password.compare(plainPassword, hash2)).toBe(true);
    });
});