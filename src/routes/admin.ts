import { FastifyInstance } from "fastify";
import { getDashboard } from "../controllers/admin.controller";

export default async function adminRouter(fastify: FastifyInstance) {
    fastify.get("/dashboard", getDashboard); // GET /api/admin/dashboard
}
