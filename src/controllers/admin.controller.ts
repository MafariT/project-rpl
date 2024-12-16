import { FastifyReply, FastifyRequest } from "fastify";
import { initORM } from "../utils/db";
import { z, ZodError } from "zod";
import { subWeeks, subMonths, isAfter, differenceInYears, getDay } from "date-fns";
import { QueryParams } from "../types/query-params";
import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { EntityExistsError } from "../utils/erros";
import { Admin } from "../models/admin/admin.entity";

const adminSchema = z.object({
    nip: z.string().min(16).max(16),
    nama: z.string().min(1).max(128),
    jenisKelamin: z.string().min(1).max(16),
    alamat: z.string().min(1).max(128),
    noTel: z.string().min(11).max(16),
    tanggalLahir: z.string().min(1).max(12),
});

export async function getDashboardAdmin(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const validFilter = z.enum(["weekly", "monthly"]);
    const { filter } = request.query;

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.findAndCount({});
        let records = pendaftaranBerobat[0];

        if (filter && validFilter.safeParse(filter).success) {
            const now = new Date();
            const cutoffDate = filter === "weekly" ? subWeeks(now, 1) : subMonths(now, 1);

            records = records.filter((record) => isAfter(new Date(record.created), cutoffDate));
        }

        const presentCount = records.filter((record) => record.isPresent === true).length;
        const notPresentCount = records.filter((record) => record.isPresent === false).length;

        const now = new Date();
        const ageGroups = { anakAnak: 0, remaja: 0, dewasa: 0 };

        const daysOfWeek = {
            senin: 0,
            selasa: 0,
            rabu: 0,
            kamis: 0,
            jumat: 0,
            sabtu: 0,
            minggu: 0,
        };

        records.forEach((record) => {
            const createdDate = new Date(record.created);
            const age = differenceInYears(now, new Date(record["tanggalLahir"]));
            const day = getDay(createdDate);

            switch (day) {
            case 1:
                daysOfWeek.senin++;
                break;
            case 2:
                daysOfWeek.selasa++;
                break;
            case 3:
                daysOfWeek.rabu++;
                break;
            case 4:
                daysOfWeek.kamis++;
                break;
            case 5:
                daysOfWeek.jumat++;
                break;
            case 6:
                daysOfWeek.sabtu++;
                break;
            case 0:
                daysOfWeek.minggu++;
                break;
            }

            if (age <= 12) {
                ageGroups.anakAnak++;
            } else if (age <= 21) {
                ageGroups.remaja++;
            } else {
                ageGroups.dewasa++;
            }
        });
        const badReview = await db.ulasan.count();

        return reply.send({
            total: records.length,
            present: presentCount,
            notPresent: notPresentCount,
            anakAnak: ageGroups.anakAnak,
            remaja: ageGroups.remaja,
            dewasa: ageGroups.dewasa,
            badReview,
            daysOfWeek,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getPendaftaranAdmin(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const validFilter = z.enum(["weekly", "monthly"]);
    const { filter } = request.query;

    try {
        const pendaftaranBerobat = await db.pendaftaranBerobat.findAll();
        let records = pendaftaranBerobat;

        if (filter && validFilter.safeParse(filter).success) {
            const now = new Date();
            const cutoffDate = filter === "weekly" ? subWeeks(now, 1) : subMonths(now, 1);

            records = records.filter((record) => isAfter(new Date(record.created), cutoffDate));
        }

        const presentCount = records.filter((record) => record.isPresent === true).length;
        const notPresentCount = records.filter((record) => record.isPresent === false).length;

        return reply.send({
            pendaftaranBerobat: records,
            present: presentCount,
            notPresent: notPresentCount,
        });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getUlasanAdmin(request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) {
    const db = await initORM();
    const validFilter = z.enum(["weekly", "monthly"]);
    const { filter } = request.query;

    try {
        // Fetch all records from the database
        const ulasan = await db.ulasan.findAll();

        let filteredRecords = ulasan;

        // Apply filter if valid filter is provided
        if (filter && validFilter.safeParse(filter).success) {
            const now = new Date();
            const cutoffDate = filter === "weekly" ? subWeeks(now, 1) : subMonths(now, 1);

            // Filter records based on the cutoff date
            filteredRecords = ulasan.filter((record) => {
                return new Date(record.created) >= cutoffDate;
            });
        }

        // Fetch pasien details for each ulasan item using Promise.all
        const ulasanDetails = await Promise.all(
            filteredRecords.map(async (ulasanItem) => {
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

        // Count filtered records
        const recordsCount = ulasanDetails.length;

        return reply.send({ ulasanCount: recordsCount, ulasanDetails });
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

export async function setVerified(
    request: FastifyRequest<{ Querystring: QueryParams; Body: { message: string } }>,
    reply: FastifyReply,
) {
    const db = await initORM();
    const validFilter = z.enum(["yes", "no"]);
    const { filter, id } = request.query;
    const { message } = request.body;

    const transporter = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
            user: process.env.SENDINBLUE_EMAIL,
            pass: process.env.SENDINBLUE_API_KEY,
        },
    });

    try {
        // Validate the filter
        if (!filter || !validFilter.safeParse(filter).success) {
            return reply.status(400).send({ error: "Invalid filter value. Use 'yes' or 'no'." });
        }
        const pendaftaranBerobat = await db.pendaftaranBerobat.findOne({ idPendaftaran: id as any });
        if (!pendaftaranBerobat) {
            return reply.status(404).send({ message: `${id} Not found` });
        }
        pendaftaranBerobat.isPresent = filter === "yes";
        await db.pendaftaranBerobat.flush();

        const pendaftaranBerobatRow = await db.pendaftaranBerobat.findOne({ idPendaftaran: id as any });
        const pasienRow = await db.pasien.findOne({ idPasien: pendaftaranBerobatRow?.fk });
        const user = await db.user.findOne({ id: pasienRow?.fk });

        await transporter.sendMail({
            from: `"PuskeSmart" <${process.env.SENDER_EMAIL}>`,
            to: user?.email,
            subject: "Kehadiran",
            html: `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&family=Roboto:wght@400;500;600&display=swap" rel="stylesheet">
                    <style>
                        body {
                            font-family: 'Poppins', sans-serif;
                            background-image: url('https://yourwebsite.com/img/asset/bg.jpg');
                            background-size: cover;
                            background-position: center;
                            background-repeat: no-repeat;
                            color: #333;
                            padding: 40px;
                        }
                        .container {
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 15px;
                            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
                            max-width: 600px;
                            margin: auto;
                        }
                        .logo {
                            display: block;
                            margin: 0 auto 20px;
                            max-width: 200px;
                        }
                        h1 {
                            color: #2c3e50;
                            text-align: center;
                            font-size: 2rem;
                            margin-bottom: 20px;
                        }
                        p {
                            color: #34495e;
                            font-size: 1rem;
                            line-height: 1.6;
                        }
                        a {
                            color: #3498db;
                            text-decoration: none;
                            font-weight: bold;
                        }
                        .footer {
                            margin-top: 30px;
                            text-align: center;
                            color: #7f8c8d;
                            font-size: 0.9rem;
                        }
                    </style>
                </head>

                <body>

                    <div class="container">
                        <!-- Logo -->
                        <img src="cid:logo" alt="Logo" class="logo">
                        
                        <!-- Email Content -->
                        <p>${message}</p>
                        <div class="footer">
                            <p>Terima kasih,<br>PuskeSmart Team</p>
                        </div>
                    </div>

                </body>

                </html>
                `,
            attachments: [
                {
                    filename: "logo.png",
                    path: "src/public/img/asset/logoHer.png",
                    cid: "logo",
                },
            ],
        });

        return reply.send({ message: `${id} successfully updated` });
    } catch (error) {
        console.error("Error updating isPresent:", error);
        return reply.status(500).send({ error: "Internal Server Error" });
    }
}

export async function getAdminByUser(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId: any = request.user?.id;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const admin = await db.admin.findOne({ fk: userId });
        if (!admin) {
            return reply.status(404).send({ message: "Admin record not found" });
        }

        return reply.status(200).send(admin);
    } catch (error) {
        console.error("Error fetching admin:", error);
        return reply.status(500).send("Internal Server Error");
    }
}

export async function createAdmin(request: FastifyRequest<{ Body: Admin }>, reply: FastifyReply) {
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
                const patientData = await db.admin.findOne({ fk });

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

        adminSchema.parse(payload);
        const { nip, nama, jenisKelamin, alamat, noTel, tanggalLahir } = payload;
        await db.admin.saveOrUpdate(nip, nama, jenisKelamin, alamat, noTel, tanggalLahir, fileName, fk);

        return reply.status(201).send({
            message: `Admin ${nama} successfully created`,
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

export async function deletePic(request: FastifyRequest, reply: FastifyReply) {
    const db = await initORM();
    const userId: any = request.user?.id;

    if (!userId) {
        return reply.status(401).send({ message: "Unauthorized" });
    }

    try {
        const admin = await db.admin.findOne({ fk: userId });
        if (!admin) {
            return reply.status(404).send({ message: "admin record not found" });
        }

        const oldFileName = admin.fotoProfil;
        if (oldFileName && oldFileName !== "kosong.jpg") {
            const uploadDir = path.join(__dirname, "../uploads");
            const oldFilePath = path.join(uploadDir, oldFileName);

            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
        }

        admin.fotoProfil = "kosong.jpg";
        await db.admin.saveOrUpdate(
            admin.nip,
            admin.nama,
            admin.jenisKelamin,
            admin.alamat,
            admin.noTel,
            admin.tanggalLahir,
            admin.fotoProfil,
            admin.fk,
        );

        return reply.status(200).send({ message: "Picture successfully deleted" });
    } catch (error) {
        console.error("Error removing profile picture:", error);
        return reply.status(500).send("Internal Server Error");
    }
}
