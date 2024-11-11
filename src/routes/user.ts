import { FastifyInstance } from "fastify";
import { createUser, deleteUser, getUser, getUserById } from "../controllers/user.controller";

export default async function userRouter(fastify: FastifyInstance) {
    fastify.get("/admin", getUser); // GET /api/user/admin
    fastify.get("/", getUserById); // GET /api/user/
    fastify.post("/", createUser); // POST /api/user
    fastify.delete("/:id", deleteUser); // DELETE /api/user/:id
}
