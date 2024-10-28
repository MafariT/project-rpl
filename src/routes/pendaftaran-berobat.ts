import { createPendaftaranBerobat, getPendaftaranBerobat } from "../controllers/pendaftaran-berobat.controller";
import { FastifyInstance } from "fastify";

export default async function PendaftaranBerobatRouter(fastify: FastifyInstance) {
    fastify.get("/", getPendaftaranBerobat); // GET /api/PendaftaranBerobat
    fastify.post("/", createPendaftaranBerobat); // POST /api/PendaftaranBerobat
}
