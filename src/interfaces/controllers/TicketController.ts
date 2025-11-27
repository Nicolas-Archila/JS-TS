import { GetTicketById } from './../../aplication/use-case/GetTicketById';
import { ListTickets } from './../../aplication/use-case/ListTickets';
import { CreateTicket } from './../../aplication/use-case/CreateTicket';
import { CreateTicketSchema } from './../../aplication/dtos/ticket';
import { Request, Response } from "express";
import z from "zod";
import { toHttp } from '../mappers/TicketMapper';


export class TicketController {
    constructor(
        private readonly createTicket: CreateTicket,
        private readonly listTickets: ListTickets,
        private readonly getTicketById: GetTicketById
    ) {}

    create = async (req: Request, res: Response): Promise<unknown> => {
        const parsed = CreateTicketSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: z.treeifyError(parsed.error)
            });
        }

        const ticket = await this.createTicket.execute(parsed.data);

        res.status(201).json(toHttp(ticket));
    };

    list = async (req: Request, res: Response): Promise<void> => {
        const tickets = await this.listTickets.execute();
        res.json(tickets.map(toHttp));
    };

    getById = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params;
        
        if (!id) {
            res.status(400).json({ message: "ID is required" });
            return;
        }

        const ticket = await this.getTicketById.execute(id);
        res.json(toHttp(ticket));
    };

    changeState = async (req: Request, res: Response): Promise<void> => {
        res.status(501).json({ message: "Not implemented" });
    };
}