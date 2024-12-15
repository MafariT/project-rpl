import { FastifyReply, FastifyRequest } from "fastify";
import { initORM } from "../utils/db";
import { z } from "zod";
import { subWeeks, subMonths, isAfter, differenceInYears, getDay } from "date-fns";
import { QueryParams } from "../types/query-params";
import nodemailer from "nodemailer";

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
