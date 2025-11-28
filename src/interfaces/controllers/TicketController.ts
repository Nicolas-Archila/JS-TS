import { GetTicketById } from './../../aplication/use-case/GetTicketById';
import { ListTickets } from './../../aplication/use-case/ListTickets';
import { CreateTicket } from './../../aplication/use-case/CreateTicket';
import { UpdateTicketStatus } from './../../aplication/use-case/UpdateTicketStatus';
import { CreateTicketSchema } from './../../aplication/dtos/ticket';
import { Request, Response, NextFunction } from "express";
import z from "zod";
import { toHttp } from '../mappers/TicketMapper';
import { TicketStatus } from '../../domain/values-objects/Status';

export class TicketController {
    constructor(
        private readonly createTicket: CreateTicket,
        private readonly listTickets: ListTickets,
        private readonly getTicketById: GetTicketById,
        private readonly updateTicketStatus: UpdateTicketStatus
    ) {}

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            
            if (!userId) {
                res.status(401).json({ error: "Unauthorized" });
                return;
            }

            const dataWithUser = {
                ...req.body,
                userId
            };

            const parsed = CreateTicketSchema.safeParse(dataWithUser);

            if (!parsed.success) {
                res.status(400).json({
                    errors: z.treeifyError(parsed.error)
                });
                return;
            }

            const ticket = await this.createTicket.execute(parsed.data);

            res.status(201).json(toHttp(ticket));
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const tickets = await this.listTickets.execute();
            res.json(tickets.map(toHttp));
        } catch (error) {
            next(error);
        }
    };

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            
            if (!id) {
                res.status(400).json({ message: "ID is required" });
                return;
            }

            const ticket = await this.getTicketById.execute(id);
            res.json(toHttp(ticket));
        } catch (error) {
            next(error);
        }
    };

    changeState = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!id) {
                res.status(400).json({ message: "ID is required" });
                return;
            }

            if (!status) {
                res.status(400).json({ message: "Status is required" });
                return;
            }

            // Validar que el estado sea válido
            const validStatuses: TicketStatus[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
            if (!validStatuses.includes(status)) {
                res.status(400).json({ message: "Invalid status" });
                return;
            }

            await this.updateTicketStatus.execute(id, status);

            res.status(200).json({ message: "Status updated successfully" });
        } catch (error) {
            next(error);
        }
    };
}