import { EnvVariables, loadEnv } from './env.config';
import * as dotenv from 'dotenv';

export abstract class ConfigServer {
    public readonly env: EnvVariables;

    constructor() {
        const nodeNameEnv: string = this.createPathEnv(this.nodeEnv);
        dotenv.config({
            path: nodeNameEnv,
        });
        this.env = loadEnv();
    }

    protected getEnviroment(Key: keyof typeof this.env): string | number {
        return this.env[Key];
    }

    protected getNumerEnv(Key: keyof typeof this.env): number {
        return Number(this.env[Key]);
    }

    protected get nodeEnv(): string {
        return process.env['NODE_ENV']?.trim() || '';
    }

    protected get databaseUrl(): string {
        return this.getEnviroment('DATABASE_URL').toString();
    }

    protected createPathEnv(path: string): string {
        const arrayEnv: string[] = ['env'];

        if (path.length) {
            const stringToArray: string[] = path.split('.');
            arrayEnv.unshift(...stringToArray);
        }
        return `.${arrayEnv.join('.')}`;
    }
}
