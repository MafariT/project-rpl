import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAdmin } from "../utils/auth";

export default async function viewRouter(fastify: FastifyInstance) {
    fastify.get("/login", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/login.html");
    });
    fastify.get("/register", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/register.html");
    });
    fastify.get("/admin", { preHandler: isAdmin }, (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/admin.html");
    });
}
