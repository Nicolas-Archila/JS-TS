import { describe, it, expect } from "vitest";
import { Email } from "../../src/domain/values-objects/Email";
import { TicketPriority, TicketStatus } from "../../src/domain/values-objects/Status";
import { ZTicketPriority, ZTicketStatus } from "../../src/domain/values-objects/status.zod";

describe("Email Value Object", () => {
    it("should create a valid email", () => {
        const email = Email.from("test@hospital.edu");
        expect(email.toString()).toBe("test@hospital.edu");
    });

    it("should throw error for invalid email", () => {
        expect(() => Email.from("invalid-email")).toThrow("Invalid email format");
    });

    it("should compare two emails", () => {
        const email1 = Email.from("test@hospital.edu");
        const email2 = Email.from("test@hospital.edu");
        const email3 = Email.from("other@hospital.edu");

        expect(email1.equals(email2)).toBe(true);
        expect(email1.equals(email3)).toBe(false);
    });
});

describe("TicketStatus", () => {
    it("should have all valid statuses", () => {
        const validStatuses: string[] = ['OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'CANCELLED'];
        
        expect(TicketStatus).toEqual(validStatuses);
    });

    it("should validate status with Zod", () => {
        const result = ZTicketStatus.safeParse("OPEN");
        expect(result.success).toBe(true);
        
        if (result.success) {
            expect(result.data).toBe("OPEN");
        }
    });

    it("should reject invalid status with Zod", () => {
        const result = ZTicketStatus.safeParse("INVALID_STATUS");
        expect(result.success).toBe(false);
    });
});

describe("TicketPriority", () => {
    it("should have all valid priorities", () => {
        const validPriorities: string[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
        
        expect(TicketPriority).toEqual(validPriorities);
    });

    it("should validate priority with Zod", () => {
        const result = ZTicketPriority.safeParse("HIGH");
        expect(result.success).toBe(true);
        
        if (result.success) {
            expect(result.data).toBe("HIGH");
        }
    });

    it("should reject invalid priority with Zod", () => {
        const result = ZTicketPriority.safeParse("CRITICAL");
        expect(result.success).toBe(false);
    });
});