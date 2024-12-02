import dotenv from "dotenv";
import { Pasien } from "../models/pasien/pasien.entity";
import { User } from "../models/user/user.entity";
import { Dokter } from "../models/dokter/dokter.entity";
import { PendaftaranBerobat } from "../models/pendaftaran-berobat/pendaftaran-berobat.entity";
import { Informasi } from "../models/informasi/informasi.entity";
import { Ulasan } from "../models/ulasan/ulasan.entity";

dotenv.config();

export default {
    entities: [Pasien, User, Dokter, PendaftaranBerobat, Informasi, Ulasan],
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: process.env.NODE_ENV !== "production",
};
