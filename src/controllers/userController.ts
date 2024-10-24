import { FastifyRequest, FastifyReply } from "fastify";
import { initORM } from "../utils/db";
import z from "zod";
import { User } from "../models/user/user.entity";
import { ExistsError } from "../utils/erros";
import { QueryParams } from "../types/query-params";

const userSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
});

export async function getUser(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;
    try {
        const users = await db.user.fetch(filter, value);
        return reply.status(200).send(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        return reply.status(500);
    }
}

export async function createUser(request: FastifyRequest<{ Body: User }>, reply: FastifyReply) {
    const db = await initORM();
    const { username, email, password } = request.body;

    try {
        userSchema.parse({ username, email, password }); // Validation

        await db.user.save(username, email, password);
        return reply.status(201).send({ message: `User ${username} successfully created` });
    } catch (error) {
        if (error instanceof ExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        console.error("Error creating user:", error);
        return reply.status(500);
    }
}
