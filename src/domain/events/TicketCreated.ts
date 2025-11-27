import { DomainEvent } from "./DomainEvent";

export interface TicketCreated extends DomainEvent {
    type: "ticket.created";
    occurredAt: Date;   // ✔️ requerido por los tests
    payload: {
        id: string;
        title: string;
        userId: string;
        areaId: string;
    };
}
