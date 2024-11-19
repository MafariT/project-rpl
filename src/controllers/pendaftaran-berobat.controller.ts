import { FastifyRequest, FastifyReply } from "fastify";
import { QueryParams } from "../types/query-params";
import { PendaftaranBerobat } from "../models/pendaftaran-berobat/pendaftaran-berobat.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { EntityExistsError } from "../utils/erros";

const pendaftaranBerobatSchema = z.object({
    nik: z.string().min(1).max(255),
    nama: z.string().min(1).max(255),
    alamat: z.string().min(1).max(255),
    noTel: z.string().min(1).max(255),
    poli: z.string().min(1).max(255),
    keluhan: z.string().min(1).max(255),
    namaDokter: z.string().min(1).max(255),
    jam: z.string().min(1).max(255),
    jenisPembayaran: z.string().min(1).max(255),
    totalPembayaran: z.string().min(1).max(255),
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

export async function getPendaftaranBerobatByUser(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId = request.user?.id;
    const fk: any = await db.pasien.findOne({ fk: userId });

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.find({ fk: fk });
        if (!pendaftaranBerobat) {
            return reply.status(404).send({ message: "pendaftaranBerobat record not found" });
        }

        return reply.status(200).send(pendaftaranBerobat);
    } catch (error) {
        console.error("Error fetching pendaftaranBerobat:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function getPendaftaranBerobatById(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId = request.user?.id;
    const { id } = request.params as any;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.findOne(id);
        if (!pendaftaranBerobat) {
            return reply.status(404).send({ message: "pendaftaranBerobat record not found" });
        }

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
    const userId = request.user?.id;
    const fk: any = await db.pasien.findOne({ fk: userId });

    try {
        const payload: any = {};
        const parts = request.parts();

        for await (const part of parts) {
            if (part.type === "field") {
                payload[part.fieldname] = part.value;
            }
        }

        pendaftaranBerobatSchema.parse(payload); // Validation
        const {
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            totalPembayaran,
        } = payload;

        await db.pendaftaranBerobat.save(
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            totalPembayaran,
            fk,
        );
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

export async function updatePendaftaranBerobatById(
    request: FastifyRequest<{ Body: PendaftaranBerobat }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const userId = request.user?.id;
    const fk: any = await db.pasien.findOne({ fk: userId });
    const { id } = request.params as any;
    console.log(`id DAFTAR: ${id}`);

    try {
        const payload: any = {};
        const parts = request.parts();

        for await (const part of parts) {
            if (part.type === "field") {
                payload[part.fieldname] = part.value;
            }
        }

        pendaftaranBerobatSchema.parse(payload); // Validation
        const {
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            totalPembayaran,
        } = payload;

        await db.pendaftaranBerobat.update(
            id,
            nik,
            nama,
            jenisKelamin,
            alamat,
            noTel,
            tanggalLahir,
            tanggalPengajuan,
            poli,
            keluhan,
            namaDokter,
            jam,
            jenisPembayaran,
            totalPembayaran,
            fk,
        );
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

export async function deletePendaftaranBerobatById(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId = request.user?.id;
    const { id } = request.params as any;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.findOne(id);
        if (!pendaftaranBerobat) {
            return reply.status(404).send({ message: "pendaftaranBerobat record not found" });
        }

        await db.pendaftaranBerobat.remove(pendaftaranBerobat);
        return reply.status(200).send({ message: "Pendaftaran Berobat deleted successfully" });
    } catch (error) {
        console.error("Error fetching pendaftaranBerobat:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
