import { FastifyInstance } from "fastify";
import {
    createAdmin,
    deletePic,
    getAdminByUser,
    getDashboardAdmin,
    getPendaftaranAdmin,
    getUlasanAdmin,
    setVerified,
} from "../controllers/admin.controller";

export default async function adminRouter(fastify: FastifyInstance) {
    fastify.get("/dashboard-admin", getDashboardAdmin); // GET /api/admin/dashboard-admin
    fastify.get("/pendaftaran-admin", getPendaftaranAdmin); // GET /api/admin/pendaftaran-admin
    fastify.get("/ulasan-admin", getUlasanAdmin); // GET /api/admin/ulasan-admin
    fastify.get("/delete-pic", deletePic); // GET /api/admin/delete-pic
    fastify.get("/user", getAdminByUser); // GET /api/admin/user
    fastify.post("/", createAdmin); // POST /api/admin
    fastify.post("/set-verified", setVerified); // POST /api/admin/set-verified
}
