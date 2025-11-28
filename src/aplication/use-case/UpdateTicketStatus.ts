import { TicketRespository } from "../ports/TicketRepository";
import { TicketStatus } from "../../domain/values-objects/Status";
import { canTransition } from "../../domain/services/TicketSataeMachine";

export class UpdateTicketStatus {
    constructor(private readonly repo: TicketRespository) {}

    async execute(ticketId: string, newStatus: TicketStatus): Promise<void> {
        const ticket = await this.repo.findById(ticketId);

        if (!ticket) {
            throw Object.assign(
                new Error("Ticket not found"),
                { statusCode: 404 }
            );
        }

        // Validar que la transición de estado sea válida
        if (!canTransition(ticket.status, newStatus)) {
            throw Object.assign(
                new Error(`Cannot transition from ${ticket.status} to ${newStatus}`),
                { statusCode: 400 }
            );
        }

        // Actualizar el estado
        ticket.status = newStatus;

        // Guardar en la base de datos
        await this.repo.save(ticket);
    }
}