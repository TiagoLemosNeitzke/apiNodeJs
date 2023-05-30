import { compare, hash } from "bcrypt";
import { ICreate, IUpdate } from "../interfaces/UsersInterfaces";
import { UsersRepository } from "../repositories/UsersRepository";
import { s3 } from "../config/aws";
import { sign } from "jsonwebtoken";

class UsersServices {
    private usersRepository: UsersRepository;

    constructor() {
        this.usersRepository = new UsersRepository();
    }

    async create({ name, email, password }: ICreate) {
        const findUser = await this.usersRepository.findUserByEmail(email);

        if (findUser) {
            throw new Error('User already exists');
        }

        const hashPassword = await hash(password, 8);

        const create = await this.usersRepository.create({
            name,
            email,
            password: hashPassword
        });

        return create;
    }

    async update({
        name,
        old_password,
        new_password,
        avatar_url,
        user_id
    }: IUpdate) {
        let password
        if (old_password && new_password) {
            const findUserById = await this.usersRepository.findUserById(user_id);

            if (!findUserById) {
                throw new Error('User not found.');
            }

            const comparePassword = await compare(old_password, findUserById.password);

            if (!comparePassword) {
                throw new Error('Password invalid.');
            }
            password = await hash(new_password, 8);

            await this.usersRepository.updatePassword(password, user_id);
        }

        if (avatar_url) {
            const uploadImage = avatar_url?.buffer

            const uploadS3 = await s3.upload({
                Bucket: 'hero-code',
                Key: `${Date.now()}-${avatar_url?.originalname}`,
                //ACL: 'public-read',
                Body: uploadImage,
            }).promise();
            console.log("url imagem => ", uploadS3.Location);

            await this.usersRepository.update(name, uploadS3.Location, user_id);
        }

        return {
            message: 'User updated successfully.'
        }
    }

    async auth(email: string, password: string) {
        const findUser = await this.usersRepository.findUserByEmail(email);

        if (!findUser) {
            throw new Error('User or password invalid.');
        }

        const comparePassword = await compare(password, findUser.password);

        if (!comparePassword) {
            throw new Error('User or password invalid.');
        }

        let secretKey: string | undefined = process.env.ACCESS_KEY_TOKEN;

        if (!secretKey) {
            throw new Error('Secret key not found.');
        }

        const token = sign({ email }, secretKey, {
            subject: findUser.id,
            expiresIn: 60 * 15
        });

        return {
            user: {
                name: findUser.name,
                email: findUser.email,
            },
            token
        }
    }
}


export { UsersServices }