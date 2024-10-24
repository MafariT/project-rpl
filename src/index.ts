import Fastify, { FastifyInstance } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import { initORM } from "./utils/db";
import pasienRouter from "./routes/pasien";
import userRouter from "./routes/user";

const fastify: FastifyInstance = Fastify({ logger: true });
const PORT = 3000;

// Initialize database
initORM();

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public/static"),
});

// fastify.get("/*", (request: FastifyRequest<{ Params: { "*": string } }>, reply) => {
//     const requestedFile = request.params["*"];
//     const filePath = `${requestedFile}.html`; // Append .html to the requested path

//     // Serve the requested HTML file
//     reply.sendFile(filePath);
// });

// Routes
fastify.register(pasienRouter, { prefix: "/api/pasien" });
fastify.register(userRouter, { prefix: "/api/user" });

fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
