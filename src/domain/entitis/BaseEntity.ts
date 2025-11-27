import { DomainEevent } from '../events/DomainEvent';

export abstract class BaseEntity<IdType = string> {
    public readonly _domainEvents: DomainEevent[] = [];
    constructor(
        public readonly id: IdType,
        public readonly createdAt: Date = new Date(),
    ) {}

    public equals(entity?: BaseEntity<IdType>): boolean {
        if (!entity) return false;
        return this.id === entity.id;
    }

    protected recordEvent(event: DomainEevent): void {
        this._domainEvents.push(event);
    }

    public pullDomainEvents(): DomainEevent[] {
        const events = [...this._domainEvents];
        this._domainEvents.length = 0;
        return events;
    }
}
