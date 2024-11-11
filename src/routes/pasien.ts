import { createPasien, getPasien, getPasienByUser } from "../controllers/pasien.controller";
import { FastifyInstance } from "fastify";

export default async function pasienRouter(fastify: FastifyInstance) {
    fastify.get("/admin", getPasien); // GET /api/pasien/admin
    fastify.get("/", getPasienByUser); // GET /api/pasien
    fastify.post("/", createPasien); // POST /api/pasien
}
