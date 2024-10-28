import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAdmin } from "../utils/auth";

export default async function viewRouter(fastify: FastifyInstance) {
    fastify.get("/login", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/login.html");
    });
    fastify.get("/register", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/register.html");
    });
    fastify.get("/pasien-regis", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/pasien-regis.html");
    });
    fastify.get("/pendaftaran-berobat", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/pendaftaran-berobat.html");
    });
    fastify.get("/admin", { preHandler: isAdmin }, (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/admin.html");
    });
}
