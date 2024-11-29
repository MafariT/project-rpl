import { FastifyInstance } from "fastify";
import {
    forgotPassword,
    login,
    logout,
    register,
    resetPassword,
    resetPasswordPage,
    validateUser,
} from "../controllers/auth.controller";

export default async function authRouter(fastify: FastifyInstance) {
    fastify.post("/login", validateUser, login); // POST /api/auth/login
    fastify.post("/register", register); // POST /api/auth/register
    fastify.post("/forgot-password", forgotPassword); // POST /api/auth/forgot-password
    fastify.post("/reset-password/:token", resetPassword); // POST /api/auth/forgot-password/:token
    fastify.get("/logout", logout); // GET /api/auth/logout
}
