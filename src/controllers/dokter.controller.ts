import { FastifyRequest, FastifyReply } from "fastify";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { Dokter } from "../models/dokter/dokter.entity";
import { EntityExistsError, EntityNotFound } from "../utils/erros";
import { QueryParams } from "../types/query-params";

const dokterSchema = z.object({
    nama: z.string().min(1).max(255),
    poli: z.string().min(1).max(255),
    jamMulai: z.string().min(1).max(255),
    jamSelesai: z.string().min(1).max(255),
});

export async function getDokter(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const dokter = await db.dokter.fetch(filter, value);
        return reply.status(200).send(dokter);
    } catch (error) {
        console.error("Error fetching dokter:", error);
        return reply.status(500);
    }
}

export async function createDokter(request: FastifyRequest<{ Body: Dokter }>, reply: FastifyReply) {
    const db = await initORM();
    const { nama, poli, jamMulai, jamSelesai } = request.body;

    try {
        dokterSchema.parse({ nama, poli, jamMulai, jamSelesai });
        await db.dokter.save(nama, poli, jamMulai, jamSelesai);
        return reply.status(201).send({ message: `Dokter ${nama} successfully created` });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error);
            const errorMessages = error.errors.map((err) => {
                return `${err.path.join(".")} - ${err.message}`;
            });

            return reply.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof EntityExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        console.error("Error creating dokter:", error);
        return reply.status(500);
    }
}

// export async function deleteDokter(request: FastifyRequest, reply: FastifyReply) {
//     const db = await initORM();
//     const { idDokter } = request.params as { idDokter: number };

//     if (isNaN(idDokter)) {
//         return reply.status(400).send({ message: `Dokter ${idDokter} must be a number` });
//     }

//     try {
//         await db.dokter.delete(idDokter);
//         return reply.status(201).send({ message: `Dokter ${idDokter} successfully deleted` });
//     } catch (error) {
//         if (error instanceof EntityNotFound) {
//             return reply.status(404).send({ message: error.message });
//         }
//         return reply.status(500);
//     }
// }
