import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createUser, getUser } from "../controllers/userController";
import { QueryParams } from "../types/query-params";
import { User } from "../models/user/user.entity";

export default async function userRouter(fastify: FastifyInstance) {
    // GET /api/user
    fastify.get("/", async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
        return getUser(request, reply);
    });

    // POST /api/user
    fastify.post("/", async (request: FastifyRequest<{ Body: User }>, reply: FastifyReply) => {
        return createUser(request, reply);
    });
}
