import { RequestHandler } from "express";
import { PasetoService } from "../../../infrastructure/security/PasetoService";

const paseto = new PasetoService();

export const auth: RequestHandler = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const token = authHeader.slice(7);
        const payload = await paseto.verify<{
            sub: string;
            email: string;
            role: "ADMIN" | "USER";
        }>(token);

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        };

        next();
    } catch {
        return res.status(401).json({ message: "Invalid Token" });
    }
};