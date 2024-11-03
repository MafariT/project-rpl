import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";

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
        // Also to check if the current logged user is accociated
        // FK USER ID
        const fk: any = request.user?.id;

        // const existingPasien = await db.pasien.findOne(userId);

        // if (existingPasien) {
        //     return reply.status(400).send({ message: "You can only create one Pasien record" });
        // }
        // if (!userId) {
        //     return reply.send("NO");
        // }

        pasienSchema.parse({ nik, nama, alamat, noTel, tanggalLahir, jenisKelamin }); // Validation
        await db.pasien.save(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin, fk);
        return reply.status(201).send({ message: `Pasien ${nama} successfully created` });
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
        console.error("Error creating pasien:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function getPasienByUser(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId: any = request.user?.id;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const pasien = await db.pasien.findOne(userId);
        if (!pasien) {
            return reply.status(404).send({ message: "Pasien record not found" });
        }

        return reply.status(200).send(pasien);
    } catch (error) {
        console.error("Error fetching pasien:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
