import { CreateTicketInput, RehydrateTicketDto } from './../../aplication/dtos/ticket';
import { TicketPriority, TicketStatus } from './../values-objects/Status';
import { TicketId } from './../values-objects/Ticketid';
import { TicketCreated } from "../events/TicketCreated";
import { BaseEntity } from "./BaseEntity";

export class Ticket extends BaseEntity<TicketId> {
    private constructor(
        id: TicketId,
        public title: string,
        public status: TicketStatus, // Ya está como public, perfecto
        public priority: TicketPriority,
        public readonly userId: string,
        public readonly areaId: string,
        createdAt: Date,
    ) {
        super(id, createdAt);
    }

    public static create(dto: CreateTicketInput, now: Date): Ticket {
        const ticket = new Ticket(
            TicketId.new(),
            dto.title,
            "OPEN",
            dto.priority,
            dto.userId,
            dto.areaId,
            dto.createdAt ?? now,
        );

        const event: TicketCreated = {
            type: "ticket.created",
            occurredAt: now,
            payload: {
                id: ticket.id.toString(),
                title: ticket.title,
                userId: ticket.userId,
                areaId: ticket.areaId
            }
        };

        ticket.recordEvent(event);

        return ticket;
    }

    public static rehydrate(row: RehydrateTicketDto): Ticket {
        return new Ticket(
            TicketId.from(row.id),
            row.title,
            row.status as TicketStatus,
            row.priority as TicketPriority,
            row.userId,
            row.areaId,
            new Date(row.createdAt),
        );
    }
}