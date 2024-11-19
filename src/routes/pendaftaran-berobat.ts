import { createPendaftaranBerobat, getPendaftaranBerobat, getPendaftaranBerobatById, getPendaftaranBerobatByUser } from "../controllers/pendaftaran-berobat.controller";
import { FastifyInstance } from "fastify";

export default async function PendaftaranBerobatRouter(fastify: FastifyInstance) {
    fastify.get("/admin", getPendaftaranBerobat); // GET /api/pendaftaran-berobat
    fastify.get("/user", getPendaftaranBerobatByUser); // GET /api/pendaftaran-berobat
    fastify.get("/user/:id", getPendaftaranBerobatById); // GET /api/pendaftaran-berobat/id
    fastify.post("/", createPendaftaranBerobat); // POST /api/pendaftaran-berobat
}
