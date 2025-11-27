import bcrypt from "bcryptjs";

export class Password {
    static async hash(plain: string, rounds = 12): Promise<string> {
        return bcrypt.hash(plain, rounds);
    }

    static async compare(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
}