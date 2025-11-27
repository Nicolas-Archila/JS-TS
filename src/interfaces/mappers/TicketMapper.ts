import { Ticket } from "../../domain/entitis/Ticket";

export const toHttp = (ticket: Ticket):unknown => ({
    id: ticket.id.toString(),
    title: ticket.title,
    status: ticket.status,
    priority: ticket.priority,
    userId: ticket.userId,
    areaId: ticket.areaId,
    createdAt: ticket.createdAt,
})