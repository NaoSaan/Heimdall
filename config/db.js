const mysql = require('mysql2')
const mongoose = require('mongoose');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.PG_HOST,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DABASE,
    port: process.env.PG_PORT,
});


const conectarMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Conexión exitosa a MongoDB');
    } catch (error) {
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

module.exports = {pool, conectarMongoDB};