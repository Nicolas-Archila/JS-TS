import { TicketController } from './../../controllers/TicketController';
import { Router } from "express";

import { auth } from "../middlewares/auth";
import { rbac } from "../middlewares/rbac";

export class TicketsRouter {
    public router: Router;

    constructor(private readonly controller: TicketController) {
        this.router = Router();
        this.routes();
    }

    private routes(): void {
        // Todas las rutas requieren autenticación
        this.router.use(auth);

        this.router.post("/", 
            rbac("ticket:create"),
            this.controller.create
        );

        this.router.get("/", 
            rbac("ticket:list"),
            this.controller.list
        );

        this.router.get("/:id", 
            rbac("ticket:list"),
            this.controller.getById
        );

        this.router.patch("/:id/state", 
            rbac("ticket:transition"),
            this.controller.changeState
        );
    }
}