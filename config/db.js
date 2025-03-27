const mysql = require('mysql2')
const mongoose = require('mongoose');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MY_HOST,
    user: process.env.MY_USER,
    password: process.env.MY_PASSWORD,
    database: process.env.MY_DABASE,
    port: process.env.MY_PORT,
}).promise();


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