import { FastifyInstance } from "fastify";
import { login, validateUser } from "../controllers/authController";
import { createUser } from "../controllers/userController";

export default async function authRouter(fastify: FastifyInstance) {
    fastify.post("/login", validateUser, login);
    fastify.post("/register", createUser);
}
