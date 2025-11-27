import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

export class AuthRouter {
    public router: Router;

    constructor(private readonly controller: AuthController) {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        this.router.post("/register", this.controller.register);
        this.router.post("/login", this.controller.login);
    }
}