import { Request, Response } from 'express';
import { QueryParams } from '../types/query-params';
import { User } from '../models/users';
import { getORM } from '../utils/db';

export async function getUsers(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const {
        query: { filter, value }
    } = req;

    try {
        const orm = getORM();
        const em = orm.em.fork(); // Forking the EntityManager for this request
        const userRepository = em.getRepository(User);
        let users: User[];

        if (filter && value && User.isValidFilter(filter)) {
            users = await userRepository.find({ [filter]: { $like: `%${value}%` } });
        } else {
            users = await userRepository.findAll();
        }

        return res.status(200).send(users);
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}

export async function createUser(req: Request<{}, {}, User>, res: Response) {
    const {
        body: { username, displayName }
    } = req;

    if (!username || !displayName) {
        return res.status(400).send({ message: 'Username and display name are required' });
    }

    try {
        const orm = getORM();
        const em = orm.em.fork(); // Forking the EntityManager for this request
        const userRepository = em.getRepository(User);
        const existingUser = await userRepository.findOne({ username });

        if (existingUser) {
            return res.status(409).send({ message: 'Username already exists' });
        }

        const newUser = new User(username, displayName);
        await em.persistAndFlush(newUser);

        return res.status(201).send({ message: `User ${newUser.username} successfully created` });
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
}
