import { Request, Response } from "express";
import { QueryParams } from "../types/query-params";
import { User } from "../models/user.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { UserExistsError } from "../models/user.repository";

const userSchema = z.object({
    username: z.string().min(1).max(100),
    displayName: z.string().min(1).max(100),
});

export async function getUsers(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const db = await initORM();
    const { filter, value } = req.query;

    try {
        const users = await db.user.fetchUsers(filter, value);
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.sendStatus(500);
    }
}

export async function createUser(req: Request<{}, {}, User>, res: Response) {
    const db = await initORM();
    const { username, displayName } = req.body;

    try {
        userSchema.parse({ username, displayName }); // Validation

        await db.user.saveUser(username, displayName);
        return res.status(201).send(`User ${username} successfully created`);
    } catch (error) {
        if (error instanceof ZodError) {
            return res.status(400).send(error.errors.map((err) => err.message));
        }
        if (error instanceof UserExistsError) {
            return res.status(409).send(error.message);
        }
        console.error("Error creating user:", error);
        return res.sendStatus(500);
    }
}
