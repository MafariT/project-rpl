import { FastifyInstance } from "fastify";
import { createUlasan, getUlasan } from "../controllers/ulasan.controller";

export default async function ulasanRouter(fastify: FastifyInstance) {
    fastify.get("/", getUlasan); // GET /api/ulasan/
    fastify.post("/", createUlasan); // POST /api/ulasan
}
