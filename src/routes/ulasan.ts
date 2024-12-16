import { FastifyInstance } from "fastify";
import { createUlasan, getUlasan, updateUlasan } from "../controllers/ulasan.controller";

export default async function ulasanRouter(fastify: FastifyInstance) {
    fastify.get("/", getUlasan); // GET /api/ulasan/
    fastify.post("/", createUlasan); // POST /api/ulasan
    fastify.put("/:idUlasan", updateUlasan); // PUT /api/ulasan/:idUlasan
}
