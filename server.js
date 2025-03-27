const express = require('express');
const cros = require('cors');
const dotenv = require('dotenv');
const {pool,conectarMongoDB} = require('./config/db');
dotenv.config();


const app = express();
app.use(cros());
app.use(express.json());

//CONEXTAR A MONGODB
conectarMongoDB();

//RUTAS
app.use('/api/agentes/auth',require('./routes/authRoutes.js'));

const PORT = process.env.PORT || 5000;
app.listen(PORT,() => console.log(`Servidor corriendo en el puerto ${PORT}`)    );