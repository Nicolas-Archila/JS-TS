export type Role = "ADMIN" | "USER";
export type Action = "ticket:create" | "ticket:list" | "ticket:transition";

const ACL: Record<Role, Action[]> = {
    ADMIN: ["ticket:create", "ticket:list", "ticket:transition"],
    USER: ["ticket:create", "ticket:list"]
};

export const can = (role: Role, action: Action): boolean => 
    ACL[role]?.includes(action) ?? false;