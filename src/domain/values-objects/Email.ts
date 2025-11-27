export class Email {
    private constructor(private readonly value: string) {
        this.validate(value);
    }

    private validate(email: string): void {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Invalid email format');
        }
    }

    static from(value: string): Email {
        return new Email(value);
    }

    static parse(value: string): Email {
        return new Email(value);
    }

    toString(): string {
        return this.value;
    }

    equals(other: Email): boolean {
        return this.value === other.value;
    }
}