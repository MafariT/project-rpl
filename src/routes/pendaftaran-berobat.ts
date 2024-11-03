import { createPendaftaranBerobat, getPendaftaranBerobat } from "../controllers/pendaftaran-berobat.controller";
import { FastifyInstance } from "fastify";

export default async function PendaftaranBerobatRouter(fastify: FastifyInstance) {
    fastify.get("/", getPendaftaranBerobat); // GET /api/pendaftaran-berobat
    fastify.post("/", createPendaftaranBerobat); // POST /api/pendaftaran-berobat
}
