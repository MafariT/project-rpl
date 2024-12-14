import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

const pasienSchema = z.object({
    nik: z.string().min(16).max(16),
    nama: z.string().min(1).max(128),
    jenisKelamin: z.string().min(1).max(16),
    alamat: z.string().min(1).max(128),
    noTel: z.string().min(11).max(16),
    tanggalLahir: z.string().min(1).max(12),
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

export async function getPasienById(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId = request.user?.id;
    const { id } = request.params as any;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const pasien = await db.pasien.findOne(id);
        if (!pasien) {
            return reply.status(404).send({ message: "pasien record not found" });
        }

        return reply.status(200).send(pasien);
    } catch (error) {
        console.error("Error fetching pasien:", error);
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

                let oldFileName: string | null = null;
                const patientData = await db.pasien.findOne({ fk });

                if (patientData && patientData.fotoProfil) {
                    oldFileName = patientData.fotoProfil;
                }

                const allowedImageTypes = ["image/jpeg", "image/jpg", "image/png"];
                if (!allowedImageTypes.includes(part.mimetype) && part.filename.trim() !== "") {
                    return reply.status(400).send({ message: "File harus berupa image" });
                }

                if (part.filename.trim() === "") {
                    fileName = oldFileName || "kosong.jpg";
                } else {
                    fileName = `${fk}-${part.filename}`;
                    filePath = path.join(uploadDir, fileName);

                    await pipeline(part.file, fs.createWriteStream(filePath));
                }

                // Delete the old file if it's different from the new one
                if (oldFileName && oldFileName !== fileName && oldFileName !== "kosong.jpg") {
                    const oldFilePath = path.join(uploadDir, oldFileName);
                    if (fs.existsSync(oldFilePath)) {
                        fs.unlinkSync(oldFilePath);
                    }
                }
            } else {
                // Collect other fields
                payload[part.fieldname] = part.value;
            }
        }

        pasienSchema.parse(payload);
        const { nik, nama, jenisKelamin, alamat, noTel, tanggalLahir } = payload;
        await db.pasien.saveOrUpdate(nik, nama, jenisKelamin, alamat, noTel, tanggalLahir, fileName, fk);

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
        if (error && (error as any).code === "FST_REQ_FILE_TOO_LARGE") {
            return reply.status(413).send({ message: "File is too large" });
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

export async function deletePic(request: FastifyRequest, reply: FastifyReply) {
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

        const oldFileName = pasien.fotoProfil;
        if (oldFileName && oldFileName !== "kosong.jpg") {
            const uploadDir = path.join(__dirname, "../uploads");
            const oldFilePath = path.join(uploadDir, oldFileName);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        pasien.fotoProfil = "kosong.jpg";
        await db.pasien.saveOrUpdate(
            pasien.nik,
            pasien.nama,
            pasien.jenisKelamin,
            pasien.alamat,
            pasien.noTel,
            pasien.tanggalLahir,
            pasien.fotoProfil,
            pasien.fk,
        );

        return reply.status(200).send({ message: "Picture successfully deleted" });
    } catch (error) {
        console.error("Error removing profile picture:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
