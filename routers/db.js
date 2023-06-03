const pgp= require("pg-promise")()
const connection = {
    host: process.env.DATABASE_HOST,
    port: 5432,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: { rejectUnauthorized: false } // This line enables SSL
};


const db = pgp(process.env.DATABASE_URL);
module.exports = db;