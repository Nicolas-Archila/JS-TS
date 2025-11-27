import { TicketStatus } from '../values-objects/Status';

const ALLOWED: Record<TicketStatus, TicketStatus[]> = {
    OPEN: ['ASSIGNED', 'CANCELLED'],
    ASSIGNED: ['IN_PROGRESS', 'CANCELLED'],
    IN_PROGRESS: ['RESOLVED', 'CANCELLED'],
    RESOLVED: ['CLOSED'],
    CLOSED: [],
    CANCELLED: [],
};

export const canTransition = (form: TicketStatus, to: TicketStatus): boolean =>
    ALLOWED[form].includes(to);
