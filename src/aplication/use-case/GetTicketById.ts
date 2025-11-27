import { TicketRespository } from "../ports/TicketRepository";

export class GetTicketById {
    constructor(private readonly repo: TicketRespository) {}

    async execute(id: string): Promise<any> {
        const ticket = await this.repo.findById(id);
        
        if (!ticket) {
            throw Object.assign(
                new Error("Ticket not found"),
                { statusCode: 404 }
            );
        }

        return ticket;
    }
}