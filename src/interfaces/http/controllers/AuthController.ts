import { Request, Response } from "express";
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

    register = async (req: Request, res: Response): Promise<unknown> => {
        const parsed = RegisterSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: z.treeifyError(parsed.error)
            });
        }

        const user = await this.registerUser.execute(parsed.data);

        return res.status(201).json(toHttp(user));
    };

    login = async (req: Request, res: Response): Promise<unknown> => {
        const parsed = LoginSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                errors: z.treeifyError(parsed.error)
            });
        }

        const { access_token, expires_in, token_type } = await this.loginUser.execute(parsed.data);

        return res.status(200).json({
            access_token,
            expires_in,
            token_type
        });
    };
}