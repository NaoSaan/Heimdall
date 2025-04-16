// Importar dependencias
require('dotenv').config();
const jwt = require("jsonwebtoken");
const moment = require("moment");


// Clave secreta
const secret = process.env.JWT_SECRET;

// Crear una funcion para generar tokens
const createToken = (agente) => {
    const payload = {
        N_Placa: agente.N_Placa,
        Rango: agente.Rango,
        iat: moment().unix(),
        exp: moment().add(2, "hours").unix()
    };
    const token = jwt.sign(payload, secret);
    // Devolver jwt token codificado
    return token;
}


module.exports = {
    secret,
    createToken
}

