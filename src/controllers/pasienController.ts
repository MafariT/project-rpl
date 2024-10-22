import { Request, Response } from "express";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien/pasien.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { ExistsError } from "../utils/erros";

const pasienSchema = z.object({
    nik: z.string().min(1).max(255),
    nama: z.string().min(1).max(255),
    alamat: z.string().min(1).max(255),
    noTel: z.coerce.number().min(1).max(255), // Parsed to number
    tanggalLahir: z.string().refine((value) => /^\d{2}-\d{2}-\d{4}$/.test(value), {
        message: "Must be in DD-MM-YYYY format",
    }),
    jenisKelamin: z.string().min(1).max(255),
});

export async function getPasien(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const db = await initORM();
    const { filter, value } = req.query;

    try {
        const pasiens = await db.pasien.fetch(filter, value);
        return res.status(200).send(pasiens);
    } catch (error) {
        console.error("Error fetching pasiens:", error);
        return res.sendStatus(500);
    }
}

export async function createPasien(req: Request<{}, {}, Pasien>, res: Response) {
    const db = await initORM();
    const { nik, nama, alamat, noTel, tanggalLahir, jenisKelamin } = req.body;

    try {
        pasienSchema.parse({ nik, nama, alamat, noTel, tanggalLahir, jenisKelamin }); // Validation

        await db.pasien.save(nik, nama, alamat, noTel, tanggalLahir, jenisKelamin);
        return res.status(201).send({ message: `Pasien ${nama} successfully created` });
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error);
            const errorMessages = error.errors.map((err) => {
                return `${err.path.join(".")} - ${err.message}`;
            });

            return res.status(400).send({ message: "Validation failed", errors: errorMessages });
        }
        if (error instanceof ExistsError) {
            return res.status(409).send({ message: error.message });
        }
        console.error("Error creating pasien:", error);
        return res.sendStatus(500);
    }
}
