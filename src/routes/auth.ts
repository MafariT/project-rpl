import { FastifyInstance } from "fastify";
import { login, validateUser } from "../controllers/auth.controller";
import { createUser } from "../controllers/user.controller";

export default async function authRouter(fastify: FastifyInstance) {
    fastify.post("/login", validateUser, login);
    fastify.post("/register", createUser);
}
