import { FastifyRequest, FastifyReply } from "fastify";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { Ulasan } from "../models/ulasan/ulasan.entity";
import { EntityExistsError } from "../utils/erros";
import { QueryParams } from "../types/query-params";

const ulasanSchema = z.object({
    rating: z.coerce.number().min(1).max(5),
    isi: z.string().min(1).max(255),
    balasan: z.string().min(1).max(255).optional(),
});

export async function getUlasan(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const ulasan = await db.ulasan.fetch(filter, value);

        if (!ulasan?.length) {
            return reply.status(404).send({ message: "Ulasan not found" });
        }

        // Fetch pasien details
        const ulasanDetails = await Promise.all(
            ulasan.map(async (ulasanItem) => {
                const pasien = await db.pasien.findOne({ idPasien: ulasanItem.fk });
                console.log(pasien);

                if (!pasien) {
                    throw new Error("Pasien not found");
                }

                return {
                    ...ulasanItem,
                    pasien: {
                        nama: pasien.nama,
                        fotoProfil: pasien.fotoProfil,
                    },
                };
            }),
        );

        return reply.status(200).send(ulasanDetails);
    } catch (error) {
        console.error("Error fetching ulasan:", error);
        return reply.status(500).send({ message: "Internal server error" });
    }
}

export async function createUlasan(request: FastifyRequest<{ Body: Ulasan }>, reply: FastifyReply) {
    const db = await initORM();
    const userId = request.user?.id;
    const fk: any = await db.pasien.findOne({ fk: userId });
    const { rating, isi, balasan } = request.body;
    if (!fk) {
        return reply.status(404).send({ message: `Pasien not Found` });
    }

    try {
        ulasanSchema.parse({ rating, isi, balasan });
        await db.ulasan.save(rating, isi, balasan, fk);
        return reply.status(201).send({ message: `Ulasan successfully created` });
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
        console.error("Error creating ulasan:", error);
        return reply.status(500);
    }
}

export async function updateUlasan(
    request: FastifyRequest<{ Body: Ulasan; Params: { idUlasan: any } }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const userId = request.user?.id;
    const fk: any = await db.admin.findOne({ fk: userId });
    const { idUlasan } = request.params;
    const { rating, isi, balasan } = request.body;
    if (!fk) {
        return reply.status(404).send({ message: `admin not Found` });
    }

    try {
        ulasanSchema.parse({ rating, isi, balasan });
        await db.ulasan.update(idUlasan, rating, isi, balasan, fk);
        return reply.status(201).send({ message: `Ulasan successfully created` });
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
        console.error("Error creating ulasan:", error);
        return reply.status(500);
    }
}
