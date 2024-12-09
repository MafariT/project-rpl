import { FastifyReply, FastifyRequest } from "fastify";
import { initORM } from "../utils/db";
import { z } from "zod";
import { subWeeks, subMonths, isAfter, differenceInYears } from "date-fns";
import { QueryParams } from "../types/query-params";

export async function getDashboard(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const validFilter = z.enum(["weekly", "monthly"]);
    const { filter } = request.query;

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.findAndCount({});
        let records = pendaftaranBerobat[0];

        if (filter && validFilter.safeParse(filter).success) {
            const now = new Date();
            const cutoffDate = filter === "weekly" ? subWeeks(now, 1) : subMonths(now, 1);

            // Filter records based on created date
            records = records.filter((record) => isAfter(new Date(record.created), cutoffDate));
        }

        const verifiedCount = records.filter((record) => record.verifikasi === true).length;
        const notVerifiedCount = records.filter((record) => record.verifikasi === false).length;
        const now = new Date();
        const ageGroups = { anakAnak: 0, remaja: 0, dewasa: 0 };

        records.forEach((record) => {
            const age = differenceInYears(now, new Date(record["tanggalLahir"]));
            if (age <= 12) {
                ageGroups.anakAnak++;
            } else if (age <= 21) {
                ageGroups.remaja++;
            } else {
                ageGroups.dewasa++;
            }
        });
        const badReview = await db.ulasan.count({ rating: 1 });

        return reply.send({
            total: records.length,
            verified: verifiedCount,
            notVerified: notVerifiedCount,
            anakAnak: ageGroups.anakAnak,
            remaja: ageGroups.remaja,
            dewasa: ageGroups.dewasa,
            badReview,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}
