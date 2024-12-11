import pg from "pg";

import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
};

export const db = new pg.Pool(dbConfig)

export const schema = 'dongill'