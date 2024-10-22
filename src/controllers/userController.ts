import { Request, Response } from "express";
import { QueryParams } from "../types/query-params";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { User } from "../models/user/user.entity";
import { ExistsError } from "../utils/erros";

const userSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
});

export async function getUser(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const db = await initORM();
    const { filter, value } = req.query;

    try {
        const users = await db.user.fetch(filter, value);
        return res.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.sendStatus(500);
    }
}

export async function createUser(req: Request<{}, {}, User>, res: Response) {
    const db = await initORM();
    const { username, email, password } = req.body;

    try {
        userSchema.parse({ username, email, password }); // Validation

        await db.user.save(username, email, password);
        return res.status(201).send({ message: `User ${username} successfully created` });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error);
            const errorMessages = error.errors.map((err) => {
                return `${err.path.join(".")} - ${err.message}`;
            });

            return res.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof ExistsError) {
            return res.status(409).send({ message: error.message });
        }
        console.error("Error creating user:", error);
        return res.sendStatus(500);
    }
}
