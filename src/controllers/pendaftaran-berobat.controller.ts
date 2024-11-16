import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { PendaftaranBerobat } from "../models/pendaftaran-berobat/pendaftaran-berobat.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";
import { Pasien } from "../models/pasien/pasien.entity";

const pendaftaranBerobatSchema = z.object({
    // fk: z.string().min(1).max(255), // ID PASIEN
    nama: z.string().min(1).max(255),
    keluhan: z.string().min(1).max(255),
    poliklinik: z.string().min(1).max(255),
    alamat: z.string().min(1).max(255),
    noTel: z.coerce.number().min(1), // Parsed to number
    tanggalLahir: z.string().refine((value) => /^\d{2}-\d{2}-\d{4}$/.test(value), {
        message: "Must be in DD-MM-YYYY format",
    }),
    jenisKelamin: z.string().min(1).max(255),
});

export async function getPendaftaranBerobat(
    request: FastifyRequest<{ Querystring: QueryParams }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const { filter, value } = request.query;

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.fetch(filter, value);
        return reply.status(200).send(pendaftaranBerobat);
    } catch (error) {
        console.error("Error fetching pendaftaranBerobat:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function createPendaftaranBerobat(
    request: FastifyRequest<{ Body: PendaftaranBerobat }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const { nama, keluhan, poliklinik, alamat, noTel, tanggalLahir, jenisKelamin, fk } = request.body;

    try {
        pendaftaranBerobatSchema.parse({ nama, keluhan, poliklinik, alamat, noTel, tanggalLahir, jenisKelamin, fk }); // Validation
        await db.pendaftaranBerobat.save(nama, keluhan, poliklinik, alamat, noTel, tanggalLahir, jenisKelamin, fk);
        return reply.status(201).send({ message: `pendaftaranBerobat ${nama} successfully created` });
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
        console.error("Error creating pendaftaranBerobat:", error);
        return reply.status(500).send("Internal Server Error");
    }
}