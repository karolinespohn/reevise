const pgp= require('pg-promise')()
const db = pgp('postgresql://localhost/flashcards');
module.exports = db;