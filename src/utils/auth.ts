import { FastifyRequest, FastifyReply } from "fastify";
import crypto from "crypto";

declare module "fastify" {
    interface PassportUser {
        role?: string;
        id?: number;
    }
}

export async function isAuthenticated(request: FastifyRequest, reply: FastifyReply) {
    if (!request.isAuthenticated()) {
        return reply.redirect("/");
    }
}

export async function isAdmin(request: FastifyRequest, reply: FastifyReply) {
    if (request.user?.role !== "admin") {
        return reply.redirect("/");
    }
}

export function generateResetToken(): { token: string; expires: Date } {
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    return { token, expires };
}
