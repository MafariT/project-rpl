import Fastify, { FastifyInstance } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import { initORM } from "./utils/db";
import pasienRouter from "./routes/pasien";
import userRouter from "./routes/user";
import { configurePassport } from "./middlewares/passport";
import fastifyFormbody from "@fastify/formbody";
import authRouter from "./routes/auth";
import { privateViewRouter, publicViewRouter } from "./routes/view";
import PendaftaranBerobatRouter from "./routes/pendaftaran-berobat";
import fastifyMultipart from "@fastify/multipart";

const envToLogger = {
    development: {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "HH:MM:ss Z",
                ignore: "pid,hostname",
            },
        },
    },
    production: true,
    test: false,
};
const fastify: FastifyInstance = Fastify({ logger: envToLogger["development"] });
const PORT = 3000;

initORM();

configurePassport(fastify);

fastify.setNotFoundHandler(async (request, reply) => {
    return reply.sendFile("/view/404.html")
});

fastify.register(fastifyMultipart, {
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    },
});
fastify.register(fastifyFormbody);
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
});
fastify.register(fastifyStatic, {
    root: path.join(__dirname, "uploads"),
    prefix: "/uploads/",
    decorateReply: false,
});

fastify.get("/view/*", async (request, reply) => {
    reply.status(403).send({ message: "Forbidden" });
});

fastify.get("/health", async (request, reply) => {
    reply.send({ status: "OK" });
});

// Routes
fastify.register(authRouter, { prefix: "/api/auth" });
fastify.register(pasienRouter, { prefix: "/api/pasien" });
fastify.register(PendaftaranBerobatRouter, { prefix: "/api/pendaftaran-berobat" });
fastify.register(userRouter, { prefix: "/api/user" });
fastify.register(publicViewRouter, { prefix: "/" });
fastify.register(privateViewRouter, { prefix: "/" });

fastify.listen({ port: PORT, host: "0.0.0.0" });
