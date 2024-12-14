import { FastifyInstance } from "fastify";
import { getDashboardAdmin, getPendaftaranAdmin, setVerified } from "../controllers/admin.controller";

export default async function adminRouter(fastify: FastifyInstance) {
    fastify.get("/dashboard-admin", getDashboardAdmin); // GET /api/admin/dashboard-admin
    fastify.get("/pendaftaran-admin", getPendaftaranAdmin); // GET /api/admin/pendaftaran-admin
    fastify.post("/set-verified", setVerified); // POST /api/admin/set-verified
}
