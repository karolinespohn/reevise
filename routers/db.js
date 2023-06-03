const pgp= require("pg-promise")()

const connectionOptions = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Skip the certificate verification (Not recommended for production)
    }
};
const db = pgp(connectionOptions);
module.exports = db;