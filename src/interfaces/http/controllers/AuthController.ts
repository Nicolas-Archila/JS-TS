import { Request, Response, NextFunction } from "express";
import z from "zod";
import { toHttp } from "../../mappers/UserMapper";
import { LoginUser } from "../../../aplication/use-case/LoginUser";
import { RegisterUser } from "../../../aplication/use-case/RegisterUser";
import { LoginSchema, RegisterSchema } from "../../../aplication/dtos/auth";

export class AuthController {
    constructor(
        private readonly registerUser: RegisterUser,
        private readonly loginUser: LoginUser
    ) {}

    register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = RegisterSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    errors: parsed.error.flatten()
                });
                return;
            }

            const user = await this.registerUser.execute(parsed.data);

            res.status(201).json(toHttp(user));
        } catch (error) {
            next(error);
        }
    };

    login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const parsed = LoginSchema.safeParse(req.body);

            if (!parsed.success) {
                res.status(400).json({
                    errors: parsed.error.flatten()
                });
                return;
            }

            const { access_token, expires_in, token_type } = await this.loginUser.execute(parsed.data);

            res.status(200).json({
                access_token,
                expires_in,
                token_type
            });
        } catch (error) {
            next(error);
        }
    };
}