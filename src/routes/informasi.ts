import { FastifyInstance } from "fastify";
import {
    createInformasi,
    deleteInformasiById,
    getInformasi,
    getInformasiById,
    updateInformasi,
} from "../controllers/informasi.controller";

export default async function informasiRouter(fastify: FastifyInstance) {
    fastify.get("/", getInformasi); // GET /api/informasi/
    fastify.get("/:id", getInformasiById); // GET /api/informasi/:idInformasi
    fastify.delete("/delete/:idInformasi", deleteInformasiById); // DELETE /delete/api/informasi/id
    fastify.post("/", createInformasi); // POST /api/informasi
    fastify.put("/:idInformasi", updateInformasi); // PUT /api/informasi/:idInformasi
}
