import { defineConfig } from '@mikro-orm/mysql';
import dotenv from 'dotenv';
import { User } from '../models/users';

dotenv.config();

export default defineConfig({
  entities: [User],
  dbName: process.env.DB_NAME,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  debug: process.env.NODE_ENV !== 'production',
});
