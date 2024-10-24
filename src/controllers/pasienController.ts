import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { ExistsError } from "../utils/erros";

const pasienSchema = z.object({
    nik: z.string().min(1).max(255),
    nama: z.string().min(1).max(255),
    alamat: z.string().min(1).max(255),
    noTel: z.coerce.number().min(1), // Parsed to number
    tanggalLahir: z.string().refine((value) => /^\d{2}-\d{2}-\d{4}$/.test(value), {
        message: "Must be in DD-MM-YYYY format",
    }),
    jenisKelamin: z.string().min(1).max(255),
});

export async function getPasien(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const pasiens = await db.pasien.fetch(filter, value);
        return reply.status(200).send(pasiens);
    } catch (error) {
        console.error("Error fetching pasiens:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function createPasien(request: FastifyRequest<{ Body: Pasien }>, reply: FastifyReply) {
    const db = await initORM();
    const { nik, nama, alamat, noTel, tanggalLahir, jenisKelamin } = request.body;

    try {
        pasienSchema.parse({ nik, nama, alamat, noTel, tanggalLahir, jenisKelamin }); // Validation

        await db.pasien.save(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin);
        return reply.status(201).send({ message: `Pasien ${nama} successfully created` });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error);
            const errorMessages = error.errors.map((err) => {
                return `${err.path.join(".")} - ${err.message}`;
            });

            return reply.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof ExistsError) {
            return reply.status(409).send({ message: error.message });
        }
        console.error("Error creating pasien:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
