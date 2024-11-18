import FastifyPassport from "@fastify/passport";
import { FastifyReply, FastifyRequest } from "fastify";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";
import { User } from "../models/user/user.entity";

const userSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
});

export const validateUser = {
    preValidation: FastifyPassport.authenticate("local", {
        failureRedirect: "/login?error=invalid-credential",
        successRedirect: "/home",
        session: true,
    }),
};

export async function login(request: FastifyRequest, reply: FastifyReply) {
    return reply.send({ message: "Login successful" });
}

export async function logout(request: FastifyRequest, reply: FastifyReply) {
    request.logout();
    return reply.redirect("/");
}

export async function register(request: FastifyRequest<{ Body: User }>, reply: FastifyReply) {
    const db = await initORM();
    const { username, email, password } = request.body;

    try {
        userSchema.parse({ username, email, password });
        await db.user.save(username, email, password);
        return reply.redirect("/login");
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error);
            const errorMessages = error.errors.map((err) => {
                return `${err.path.join(".")} - ${err.message}`;
            });

            return reply.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof EntityExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        console.error("Error creating account:", error);
        return reply.status(500);
    }
}
