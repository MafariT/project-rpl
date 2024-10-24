import { createPasien, getPasien } from "../controllers/pasienController";
import { FastifyInstance } from "fastify";

export default async function pasienRouter(fastify: FastifyInstance) {
    fastify.get("/", getPasien); // GET /api/pasien
    fastify.post("/", createPasien); // POST /api/pasien
}
