import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

class AuthMiddleware {
    auth(request: Request, response: Response, next: NextFunction) {
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            return response.status(401).json({
                code: "token.invalid",
                message: 'Token not found.'
            });
        }

        const [, token] = authHeader.split(' ');

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;

        if (!secretKey) {
            throw new Error('Secret key not found.');
        }

        try {
            const { sub } = verify(token, secretKey);

            request.user_id = sub as string;
            return next()
        } catch (error) {
            return response.status(401).json({
                code: "token.expired",
                message: 'Token expired.'
            });
        }
    }
}

export { AuthMiddleware }