import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const pasienSchema = z.object({
    nik: z.string().min(1).max(255),
    nama: z.string().min(1).max(255),
    alamat: z.string().min(1).max(255),
    noTel: z.coerce.number().min(1), // Parsed to number
    // tanggalLahir: z.string().refine((value) => /^\d{2}-\d{2}-\d{4}$/.test(value), {
    //     message: "Must be in DD-MM-YYYY format",
    // }),
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

    try {
        // FK USER ID
        const fk: any = request.user?.id;
        if (!fk) {
            return reply.status(401).send({ message: "Unauthorized" });
        }

        const parts = request.parts();
        const payload: any = {};
        let filePath: string | null = null;
        let fileName: string | null = null;

        for await (const part of parts) {
            if (part.type === "file") {
                const uploadDir = path.join(__dirname, "../uploads");
                if (!fs.existsSync(uploadDir)) {
                    fs.mkdirSync(uploadDir, { recursive: true });
                }

                fileName = `${Date.now()}-${part.filename}`;
                filePath = path.join(uploadDir, fileName);

                // Save file to disk
                await pipeline(part.file, fs.createWriteStream(filePath));
            } else {
                // Collect other fields
                payload[part.fieldname] = part.value;
            }
        }

        const { nik, nama, alamat, noTel, tanggalLahir } = payload;
        pasienSchema.parse({ nik, nama, alamat, noTel, tanggalLahir });
        await db.pasien.saveOrUpdate(nik, nama, alamat, noTel, tanggalLahir, fileName, fk);

        return reply.status(201).send({
            message: `Pasien ${nama} successfully created`,
        });
    } catch (error) {
        if (error instanceof ZodError) {
            const errorMessages = error.errors.map((err) => `${err.path.join(".")} - ${err.message}`);
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
        const pasien = await db.pasien.findOne({ fk: userId });
        if (!pasien) {
            return reply.status(404).send({ message: "Pasien record not found" });
        }

        return reply.status(200).send(pasien);
    } catch (error) {
        console.error("Error fetching pasien:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
