import { Request, Response, NextFunction } from 'express';
import { UsersServices } from '../services/UsersServices';
import { s3 } from '../config/aws';

class UsersController {
    private usersServices: UsersServices;

    constructor() {
        this.usersServices = new UsersServices();
    }

    index() { }

    show() { }

    async store(request: Request, response: Response, next: NextFunction) {
        const { name, email, password } = request.body;

        try {
            const result = await this.usersServices.create({ name, email, password })

            return response.status(201).json(result)

        } catch (error) {
            next(error)
        }
    }

    async update(request: Request, response: Response, next: NextFunction) {

        const { name, old_password, new_password } = request.body;

        const { user_id } = request;

        try {

            const result = await this.usersServices.update({
                name,
                old_password,
                new_password,
                avatar_url: request.file,
                user_id
            })

            return response.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }

    destroy() { }

    async auth(request: Request, response: Response, next: NextFunction) {
        const { email, password } = request.body;
        
        try {
            const result = await this.usersServices.auth(email, password)

            return response.status(201).json(result)
        } catch (error) {
            next(error)
        }
    }
}

export { UsersController }