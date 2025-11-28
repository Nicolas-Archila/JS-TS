import { EventBus } from './../../aplication/ports/EventBus';
import { DomainEvent } from "../../domain/events/DomainEvent"; // ✅ Corregido (también tenía un typo)
import type pino from "pino";

export class InMemoryEventBus implements EventBus {
    constructor(private readonly logger: pino.Logger) {}

    async publishAll(events: DomainEvent[]): Promise<void> { // ✅ Corregido
        for (const event of events) {
            this.logger.info({ event }, `Domain event: ${event.type}`);
        }
    }
}