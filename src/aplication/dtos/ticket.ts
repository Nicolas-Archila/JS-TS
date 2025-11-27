import { ZTicketPriority, ZTicketStatus } from './../../domain/values-objects/status.zod';
import { z } from "zod";

export const CreateTicketSchema = z.object({
    title: z.string().trim().min(3),
    priority: ZTicketPriority,
    userId: z.string(),
    areaId: z.string(),
    createdAt: z.date().optional(),
});

export type CreateTicketInput = z.infer<typeof CreateTicketSchema>;

export const TicketSchema = z.object({
    id: z.string().uuid(),
    title: z.string().trim(),
    status: ZTicketStatus,
    priority: ZTicketPriority,
    userId: z.string(),
    areaId: z.string(),
    createdAt: z.date(),
});

export type TicketDto = z.infer<typeof TicketSchema>;

export const RehydrateTicketSchema = z.object({
    id: z.string(),
    title: z.string(),
    status: z.string(),
    priority: z.string(),
    userId: z.string(),
    areaId: z.string(),
    createdAt: z.coerce.date(),
});

export type RehydrateTicketDto = z.infer<typeof RehydrateTicketSchema>;