import { createPasien, deletePic, getPasien, getPasienById, getPasienByUser } from "../controllers/pasien.controller";
import { FastifyInstance } from "fastify";

export default async function pasienRouter(fastify: FastifyInstance) {
    fastify.get("/admin", getPasien); // GET /api/pasien/admin
    fastify.get("/user", getPasienByUser); // GET /api/pasien/user
    fastify.get("/:id", getPasienById); // GET /api/pasien/id
    fastify.get("/delete-pic", deletePic); // GET /api/pasien/delete-pic
    fastify.post("/", createPasien); // POST /api/pasien
}
