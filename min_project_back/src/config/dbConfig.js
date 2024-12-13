import pg from "pg";

import dotenv from "dotenv";

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';

let hostAdress;
if (process.env.NODE_ENV === 'production') {
    hostAdress = '/cloudsql/winged-woods-442503-f1:asia-northeast3:codelab';
} else {
    hostAdress = '34.64.248.193';
}

const dbConfig = {
    host: hostAdress, 
    port: 5432,
    database: 'postgres',
    user: 'codelab',
    password : 'codelab1234',
};
// const dbConfig = {
//     host: hostAdress,
//     port: process.env.DB_PORT,
//     database: process.env.DB_DATABASE,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
// };

export const db = new pg.Pool(dbConfig)

export const schema = 'dongill'