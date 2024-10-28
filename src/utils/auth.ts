import { FastifyRequest, FastifyReply } from "fastify";

declare module "fastify" {
    interface PassportUser {
        role?: string;
        id?: number;
    }
}

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isAuthenticated()) {
        return reply.status(401).send({ message: "Unauthorized" });
    }
}

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
    if (request.user?.role !== "admin") {
        return reply.status(403).send({ message: "Forbidden" });
    }
}
