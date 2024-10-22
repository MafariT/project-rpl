import dotenv from "dotenv";
import { Pasien } from "../models/pasien.entity";

dotenv.config();

export default {
    entities: [Pasien],
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: process.env.NODE_ENV !== "production",
};
