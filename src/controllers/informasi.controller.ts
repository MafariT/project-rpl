import { FastifyRequest, FastifyReply } from "fastify";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { Informasi } from "../models/informasi/informasi.entity";
import { EntityExistsError, EntityNotFound } from "../utils/erros";
import { QueryParams } from "../types/query-params";

const informasiSchema = z.object({
    foto: z.string().min(1).max(255),
    judul: z.string().min(1).max(255),
    isi: z.string().min(1).max(255),
});

export async function getInformasi(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const informasis = await db.informasi.fetch(filter, value);
        return reply.status(200).send(informasis);
    } catch (error) {
        console.error("Error fetching informasis:", error);
        return reply.status(500);
    }
}

export async function createInformasi(request: FastifyRequest<{ Body: Informasi }>, reply: FastifyReply) {
    const db = await initORM();
    const { foto, judul, isi } = request.body;

    try {
        informasiSchema.parse({ foto, judul, isi });
        await db.informasi.saveOrUpdate( foto, judul, isi);
        return reply.status(201).send({ message: `Informasi ${judul} successfully created` });
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
        console.error("Error creating informasi:", error);
        return reply.status(500);
    }
}

// export async function deleteInformasi(request: FastifyRequest, reply: FastifyReply) {
//     const db = await initORM();
//     const { id } = request.params as { id: number };

//     if (isNaN(id)) {
//         return reply.status(400).send({ message: `Informasi ${id} must be a number` });
//     }

//     try {
//         await db.informasi.delete(id);
//         return reply.status(201).send({ message: `Informasi ${id} successfully deleted` });
//     } catch (error) {
//         if (error instanceof EntityNotFound) {
//             return reply.status(404).send({ message: error.message });
//         }
//         return reply.status(500);
//     }
// }
