import { InMemoryEventBus } from './../infrastructure/events/InMemoryEventBus';
import { LocalClock } from './../aplication/ports/Clock';
import cors from "cors";
import express, { Application, Router, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import { PrismaTicketRepository } from "../infrastructure/repositories/PrismaTicketRepository";
import { PrismaUserRepository } from "../infrastructure/repositories/PrismaUserRepository";
import { prismaClient } from "../infrastructure/db/prisma";
import { AuthModule } from "../modules/AuthModule";
import { TicketModule } from "../modules/TicketModule";
import { ConfigServer } from "./ConfigServer";
import { createLogger } from "./logger";

export class ServerBootstrap extends ConfigServer {
    private _app: Application = express();
    private _port: number;
    private _logger: ReturnType<typeof createLogger>;

    constructor() {
        super();

        this._port = this.getNumerEnv("PORT");
        this._logger = createLogger(this.env);

        this.configureMiddleware();

        this._app.use("/api", ...this._routers());

        // ✅ Agregar manejo de errores global
        this.configureErrorHandler();

        this.listen();
        this.handleShutdown();
    }

    private configureMiddleware(): void {
        this._app.use(express.json());
        this._app.use(express.urlencoded({ extended: true }));
        this._app.use(cors());
        this._app.use(morgan("dev"));
    }

    // ✅ NUEVO: Middleware de manejo de errores
    private configureErrorHandler(): void {
        this._app.use((err: any, req: Request, res: Response, next: NextFunction) => {
            this._logger.error({
                msg: "Error in request",
                error: err.message,
                stack: err.stack,
                path: req.path,
                method: req.method,
            });

            const statusCode = err.statusCode || 500;
            const message = err.message || "Internal Server Error";

            res.status(statusCode).json({
                error: message,
                ...(this.getEnviroment("NODE_ENV") === "development" && { stack: err.stack }),
            });
        });
    }

    public listen(): void {
        this._app.listen(this._port, async () => {
            this._logger.info(`Server listen on port: ${this._port} in ${this.getEnviroment("NODE_ENV")} mode`);
            this._logger.info(`http://localhost:${this._port}`);

            await this.dbConnection();
        });
    }

    private async dbConnection(): Promise<void> {
        try {
            await prismaClient.$connect();
            this._logger.info("Prisma connected to the database");
        } catch (error) {
            this._logger.error({
                msg: "Error connecting Prisma to the database",
                error: error instanceof Error ? error.message : String(error),
                stack: error instanceof Error ? error.stack : undefined,
            });
            throw error;
        }
    }

    private _routers = (): Router[] => {
        const ticketRepository = new PrismaTicketRepository();
        const userRepository = new PrismaUserRepository();

        const bus = new InMemoryEventBus(this._logger);
        const clock = new LocalClock();

        return [
            new AuthModule(userRepository, bus, clock).router(),
            new TicketModule(ticketRepository, bus, clock).router(),
        ];
    };

    private handleShutdown(): void {
        process.on("SIGINT", async () => {
            await prismaClient.$disconnect();
            this._logger.info("Prisma disconnected on SIGINT");
            process.exit(0);
        });
        process.on("SIGTERM", async () => {
            await prismaClient.$disconnect();
            this._logger.info("Prisma disconnected on SIGTERM");
            process.exit(0);
        });
    }
}