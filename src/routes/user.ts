import { FastifyInstance } from "fastify";
import { createUser, getUser } from "../controllers/userController";

export default async function userRouter(fastify: FastifyInstance) {
    fastify.get("/", getUser); // GET /api/user
    fastify.post("/", createUser); // POST /api/user
}
