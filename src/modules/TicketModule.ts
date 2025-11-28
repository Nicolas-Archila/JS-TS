import { TicketController } from './../interfaces/controllers/TicketController';
import { GetTicketById } from './../aplication/use-case/GetTicketById';
import { ListTickets } from './../aplication/use-case/ListTickets';
import { CreateTicket } from './../aplication/use-case/CreateTicket';
import { UpdateTicketStatus } from './../aplication/use-case/UpdateTicketStatus';
import { Clock } from './../aplication/ports/Clock';
import { EventBus } from './../aplication/ports/EventBus';
import { Router } from "express";
import { TicketsRouter } from "../interfaces/http/routes/TicketsRouter";
import { TicketRespository } from '../aplication/ports/TicketRepository';

export class TicketModule {
    constructor(
        private readonly repo: TicketRespository,
        private readonly bus: EventBus,
        private readonly clock: Clock
    ) {}

    public router(): Router {
        const createTicket = new CreateTicket(this.repo, this.clock, this.bus);
        const listTickets = new ListTickets(this.repo);
        const getTicketById = new GetTicketById(this.repo);
        const updateTicketStatus = new UpdateTicketStatus(this.repo);

        const controller = new TicketController(
            createTicket, 
            listTickets, 
            getTicketById, 
            updateTicketStatus
        );

        const router = Router();
        router.use("/tickets", new TicketsRouter(controller).router);

        return router;
    }
}