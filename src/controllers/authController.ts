import FastifyPassport from "@fastify/passport";
import { FastifyReply, FastifyRequest } from "fastify";

export const validateUser = {
    preValidation: FastifyPassport.authenticate("local", {
        failureRedirect: "/login?error=invalid-credential",
        // successRedirect: "/home",
        session: true,
    }),
};

export async function login(request: FastifyRequest, reply: FastifyReply) {
    reply.send({ message: "Login successful" });
}
