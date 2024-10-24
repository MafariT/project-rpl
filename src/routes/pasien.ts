import { createPasien, getPasien } from "../controllers/pasienController";
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";

export default async function pasienRouter(fastify: FastifyInstance) {
    // GET /api/pasien
    fastify.get("/", async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
        return getPasien(request, reply);
    });
    // POST /api/pasien
    fastify.post("/", async (request: FastifyRequest<{ Body: Pasien }>, reply: FastifyReply) => {
        return createPasien(request, reply);
    });
}
