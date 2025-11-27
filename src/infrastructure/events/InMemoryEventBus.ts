import { EventBus } from './../../aplication/ports/EventBus';
import { DomainEevent } from "../../domain/events/DomainEvent";
import type pino from "pino";

export class InMemoryEventBus implements EventBus {
    constructor(private readonly logger: pino.Logger) {}

    async publishAll(events: DomainEevent[]): Promise<void> {
        for (const event of events) {
            this.logger.info({ event }, `Domain event: ${event.type}`);
        }
    }
}