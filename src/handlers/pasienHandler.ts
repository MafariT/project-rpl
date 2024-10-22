import { Request, Response } from "express";
import { QueryParams } from "../types/query-params";
import { Pasien } from "../models/pasien.entity";
import { initORM } from "../utils/db";
import z, { ZodError } from "zod";
import { PasienExistsError } from "../models/pasien.repository";

const pasienSchema = z.object({
    username: z.string().min(1).max(255),
    email: z.string().min(1).max(255),
    password: z.string().min(1).max(255),
    displayName: z.string().min(1).max(255),
});

export async function getPasien(req: Request<{}, {}, {}, QueryParams>, res: Response) {
    const db = await initORM();
    const { filter, value } = req.query;

    try {
        const pasiens = await db.pasien.fetchPasien(filter, value);
        return res.status(200).send(pasiens);
    } catch (error) {
        console.error("Error fetching pasiens:", error);
        return res.sendStatus(500);
    }
}

export async function createPasien(req: Request<{}, {}, Pasien>, res: Response) {
    const db = await initORM();
    const { nik, fullName, alamat, noTel, tanggalLahir, jenisKelamin, username, password, email } = req.body;

    try {
        // pasienSchema.parse({ username, email, password }); // Validation

        await db.pasien.save(nik, fullName, alamat, noTel, tanggalLahir, jenisKelamin, username, password, email);
        return res.status(201).send(`Pasien ${username} successfully created`);
    } catch (error) {
        if (error instanceof ZodError) {
            console.error(error)
            return res.status(400).send(error.errors.map((err) => err.message));
        }
        if (error instanceof PasienExistsError) {
            return res.status(409).send(error.message);
        }
        console.error("Error creating pasien:", error);
        return res.sendStatus(500);
    }
}
