import { User } from '../../../prisma/generated/prisma';
import { Ticket } from '../../domain/entitis/Ticket';


export interface TicketRespository {
    save(ticket: Ticket): Promise<void>;
    findById(id: string): Promise<Ticket | null>;
    list(): Promise<Ticket[]>;
}


export interface UserRepository {
    save(user: User): Promise<User>;
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}