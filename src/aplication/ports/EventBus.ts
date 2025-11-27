import { DomainEevent } from '../../domain/events/DomainEvent';

export interface EventBus {
    publishAll(events: DomainEevent[]): Promise<void>;
}
