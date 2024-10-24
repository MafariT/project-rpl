import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import path from "path";
import fastifyStatic from "@fastify/static";
import { initORM } from "./utils/db";
import pasienRouter from "./routes/pasien";
import userRouter from "./routes/user";
import { configurePassport } from "./middlewares/passport";
import fastifyFormbody from "@fastify/formbody";
import authRouter from "./routes/auth";
import viewRouter from "./routes/view";

const fastify: FastifyInstance = Fastify({ logger: true });
const PORT = 3000;

// Initialize database
initORM();

fastify.register(fastifyFormbody);

configurePassport(fastify);

fastify.register(fastifyStatic, {
    root: path.join(__dirname, "public"), // Path to your static folder
    setHeaders: (res, filepath) => {
        // Check if the file is an HTML file
        if (filepath.endsWith(".html")) {
            res.statusCode = 404; // Set status to 404
        }
    },
});
// fastify.get("/*", (request: FastifyRequest<{ Params: { "*": string } }>, reply) => {
//     const requestedFile = request.params["*"];
//     const filePath = `${requestedFile}.html`; // Append .html to the requested path

//     // Serve the requested HTML file
//     reply.sendFile(filePath);
// });

// Routes
fastify.register(viewRouter);
fastify.register(authRouter, { prefix: "/api/auth" });
fastify.register(pasienRouter, { prefix: "/api/pasien" });
fastify.register(userRouter, { prefix: "/api/user" });
// fastify.addHook("preHandler", isAuthenticated);

fastify.listen({ port: PORT }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
});
