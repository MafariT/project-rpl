import { FastifyInstance } from "fastify";
import { createDokter, getDokter } from "../controllers/dokter.controller";

export default async function dokterRouter(fastify: FastifyInstance) {
    fastify.get("/", getDokter); // GET /api/dokter/
    fastify.post("/", createDokter); // POST /api/dokter
}
