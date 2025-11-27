import { TicketRespository } from "../ports/TicketRepository";

export class ListTickets {
    constructor(private readonly repo: TicketRespository) {}

    async execute(): Promise<any> {
        return await this.repo.list();
    }
}