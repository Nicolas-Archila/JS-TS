import { Router } from "express";
import { PasetoService } from "../infrastructure/security/PasetoService";
import { AuthController } from "../interfaces/http/controllers/AuthController";
import { AuthRouter } from "../interfaces/http/routes/AuthRouter";
import { Clock } from "../aplication/ports/Clock";
import { EventBus } from "../aplication/ports/EventBus";
import { UserRepository } from "../aplication/ports/UserRepository";
import { LoginUser } from "../aplication/use-case/LoginUser";
import { RegisterUser } from "../aplication/use-case/RegisterUser";

export class AuthModule {
    constructor(
        private readonly repo: UserRepository,
        private readonly bus: EventBus,
        private readonly clock: Clock
    ) {}

    public router(): Router {
        const pasetoService = new PasetoService();
        const registerUser = new RegisterUser(this.repo, this.clock, this.bus);
        const loginUser = new LoginUser(this.repo, pasetoService);

        const controller = new AuthController(registerUser, loginUser);

        const router = Router();
        router.use("/auth", new AuthRouter(controller).router);

        return router;
    }
}