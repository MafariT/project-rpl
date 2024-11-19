import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { isAdmin, isAuthenticated } from "../utils/auth";

export async function publicViewRouter(fastify: FastifyInstance) {
    fastify.get("/", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/index.html");
    });
    fastify.get("/login", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/login.html");
    });
    fastify.get("/register", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/register.html");
    });
}

export async function privateViewRouter(fastify: FastifyInstance) {
    fastify.addHook("preHandler", isAuthenticated);

    fastify.get("/home", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/home.html");
    });
    fastify.get("/akun", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/akun.html");
    });
    fastify.get("/pendaftaran", (request: FastifyRequest, reply: FastifyReply) => {
        reply.sendFile("view/pendaftaran.html");
    });
    // fastify.get("/pasien-regis", (request: FastifyRequest, reply: FastifyReply) => {
    //     reply.sendFile("pasien-regis.html");
    // });
    // fastify.get("/pendaftaran-berobat", (request: FastifyRequest, reply: FastifyReply) => {
    //     reply.sendFile("pendaftaran-berobat.html");
    // });
    // fastify.get("/admin", { preHandler: isAdmin }, (request: FastifyRequest, reply: FastifyReply) => {
    //     reply.sendFile("view/admin.html");
    // });
}
