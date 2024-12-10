import FastifyPassport from "@fastify/passport";
import nodemailer from "nodemailer";
import { FastifyReply, FastifyRequest } from "fastify";
import { generateResetToken } from "../utils/auth";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";
import { User } from "../models/user/user.entity";

const userSchema = z.object({
    username: z.string().min(4).max(64),
    email: z.string().min(1).max(128),
    password: z.string().min(8).max(255),
});

export const validateUser = {
    preValidation: FastifyPassport.authenticate("local", {
        session: true,
    }),
};

export async function login(request: FastifyRequest, reply: FastifyReply) {
    const role = request.user?.role;
    if (role == "admin") {
        return reply.status(302).send({ message: "Login successful" });
    }
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
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: process.env.SENDINBLUE_EMAIL,
            pass: process.env.SENDINBLUE_API_KEY,
        },
    });

    const resetLink = `${request.protocol}://${request.hostname}:${request.port}/reset-password/${token}`;

    await transporter.sendMail({
        from: `"PuskeSmart" <${process.env.SENDER_EMAIL}>`,
        to: user.email,
        subject: "Password Reset Request",
        html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400;500;600&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            background-image: url('https://yourwebsite.com/img/asset/bg.jpg');
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            color: #333;
                            padding: 40px;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 15px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                            margin: auto;
                        }
                        .logo {
                            display: block;
                            margin: 0 auto 20px;
                            max-width: 200px;
                        }
                        h1 {
                            color: #2c3e50;
                            text-align: center;
                            font-size: 2rem;
                            margin-bottom: 20px;
                        }
                        p {
                            color: #34495e;
                            font-size: 1rem;
                            line-height: 1.6;
                        }
                        a {
                            color: #3498db;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #7f8c8d;
                            font-size: 0.9rem;
                        }
                    </style>
                </head>

                <body>

                    <div class="container">
                        <!-- Logo -->
                        <img src="cid:logo" alt="Logo" class="logo">
                        
                        <!-- Email Content -->
                        <h1>Permintaan Mengatur Ulang Kata Sandi</h1>
                        <p>Hallo,</p>
                        <p>Anda baru saja meminta untuk mengatur ulang kata sandi akun Anda. Untuk melanjutkan, klik tautan di bawah ini untuk membuat kata sandi baru:</p>
                        <p><a href="${resetLink}">Klik di sini untuk menyetel ulang sandi Anda</a></p>
                        <p>Tautan ini akan kedaluwarsa dalam 1 jam, Pastikan untuk menggunakannya segera.</p>

                        <p style="font-weight: 600;">Jika bukan anda yang membuat permintaan ini, Anda dapat mengabaikan email ini.</p>

                        <div class="footer">
                            <p>Terima kasih,<br>PuskeSmart Team</p>
                        </div>
                    </div>

                </body>

                </html>
                `,
        attachments: [
            {
                filename: "logo.png",
                path: "src/public/img/asset/logoHer.png",
                cid: "logo",
            },
        ],
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
