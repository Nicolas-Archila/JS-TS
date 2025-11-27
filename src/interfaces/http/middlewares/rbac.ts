import { RequestHandler } from "express";
import { Action, can } from "../../../infrastructure/security/RBAC";

export const rbac = (action: Action): RequestHandler => {
    return (req, res, next) => {
        const role = req.user?.role;

        if (!role) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        if (!can(role, action)) {
            return res.status(403).json({ message: "Forbidden" });
        }

        next();
    };
};