import { TicketPriority, TicketStatus } from './../../domain/values-objects/Status';
import { prismaClient } from "../db/prisma";
import { TicketRespository } from '../../aplication/ports/TicketRepository';
import { Ticket } from '../../domain/entities/Ticket';

export class PrismaTicketRepository implements TicketRespository {
    async save(ticket: Ticket): Promise<void> {
        await prismaClient.ticket.upsert({
            where: { id: ticket.id.toString() },
            create: {
                id: ticket.id.toString(),
                title: ticket.title,
                status: ticket.status,
                priority: ticket.priority,
                userId: ticket.userId,
                areaId: ticket.areaId,
            },
            update: {
                title: ticket.title,
                status: ticket.status,
                priority: ticket.priority,
            },
        });
    }

    async findById(id: string): Promise<Ticket | null> {
        const row = await prismaClient.ticket.findUnique({
            where: { id },
        });

        if (!row) return null;

        return Ticket.rehydrate({
            id: row.id,
            title: row.title,
            status: row.status as TicketStatus,
            priority: row.priority as TicketPriority,
            userId: row.userId,
            areaId: row.areaId,
            createdAt: row.createdAt,
        });
    }

    async list(): Promise<Ticket[]> {
        const rows = await prismaClient.ticket.findMany({
            orderBy: { createdAt: "desc" },
        });

        return rows.map((row) => Ticket.rehydrate({
            id: row.id,
            title: row.title,
            status: row.status as TicketStatus,
            priority: row.priority as TicketPriority,
            userId: row.userId,
            areaId: row.areaId,
            createdAt: row.createdAt,
        }));
    }
}