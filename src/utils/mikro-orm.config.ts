import dotenv from "dotenv";
import { Pasien } from "../models/pasien/pasien.entity";
import { User } from "../models/user/user.entity";

dotenv.config();

export default {
    entities: [Pasien, User],
    dbName: process.env.DB_NAME,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    debug: process.env.NODE_ENV !== "production",
};
