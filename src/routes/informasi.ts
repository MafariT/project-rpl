import { FastifyInstance } from "fastify";
import { createInformasi, deleteInformasiById, getInformasi } from "../controllers/informasi.controller";

export default async function informasiRouter(fastify: FastifyInstance) {
    fastify.get("/", getInformasi); // GET /api/informasi/
    fastify.post("/", createInformasi); // POST /api/informasi
    fastify.delete("/:id", deleteInformasiById); // DELETE /api/informasi/id
}
