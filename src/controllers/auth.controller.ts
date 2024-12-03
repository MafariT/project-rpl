import FastifyPassport from "@fastify/passport";
import nodemailer from "nodemailer";
import { FastifyReply, FastifyRequest } from "fastify";
import { generateResetToken } from "../utils/auth";
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
        return reply.status(201).send({ message: `User ${username} successfully created` });
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

export async function forgotPassword(request: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) {
    const db = await initORM();
    const { email } = request.body;

    const user = await db.user.findOne({ email });
    if (!user) {
        return reply.status(404).send({ message: `${email} not found` });
    }

    const { token, expires } = generateResetToken();
    user.resetToken = token;
    user.resetTokenExpires = expires;
    await db.user.flush();

    const transporter = nodemailer.createTransport({
        host: 'smtp-relay.sendinblue.com',
        port: 587,
        auth: {
            user: process.env.SENDINBLUE_EMAIL,
            pass: process.env.SENDINBLUE_API_KEY,
        },
    });
    
    

    const resetLink = `${request.protocol}://${request.hostname}:${request.port}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"Support" <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password. This link is valid for 1 hour.</p>`,
    });

    return reply.send({ message: "Password reset email sent" });
}

export async function resetPassword(
    request: FastifyRequest<{ Params: { token: string }; Body: { newPassword: string } }>,
    reply: FastifyReply,
) {
    const { token } = request.params;
    const { newPassword } = request.body;

    const db = await initORM();
    const user = await db.user.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() }, // If greater than current time -> valid
    });

    if (!user) {
        return reply.status(400).send("Invalid or expired reset token");
    }

    user.password = newPassword;
    user.resetToken = null;
    user.resetTokenExpires = null;

    await db.user.flush();

    return reply.send({ message: "Password has been successfully reset" });
}

export async function resetPasswordPage(request: FastifyRequest<{ Params: { token: string } }>, reply: FastifyReply) {
    const { token } = request.params;

    const db = await initORM();
    const user = await db.user.findOne({
        resetToken: token,
        resetTokenExpires: { $gt: new Date() },
    });

    if (!user) {
        return reply.status(400).send("Invalid or expired reset token");
    }

    return reply.sendFile("view/reset-password.html");
}
