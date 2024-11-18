import { FastifyInstance } from "fastify";
import { login, logout, register, validateUser } from "../controllers/auth.controller";

export default async function authRouter(fastify: FastifyInstance) {
    fastify.post("/login", validateUser, login); // POST /api/auth/login
    fastify.post("/register", register); // POST /api/auth/register
    fastify.get("/logout", logout); // GET /api/auth/logout
}
