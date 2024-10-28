import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getUser } from "../controllers/user.controller";

export default async function userRouter(fastify: FastifyInstance) {
    fastify.get("/", getUser); // GET /api/user
    fastify.post("/", createUser); // POST /api/user
    fastify.delete("/:id", deleteUser); // DELETE /api/user/:id
}
