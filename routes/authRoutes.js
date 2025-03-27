const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.post('/login', async (req, res) => {
  try {
    const { N_Placa, password } = req.body;
    const result = await pool.query('SELECT * FROM Agentes WHERE N_Placa = ?', [N_Placa]);
    const agente = result[0];

    if (!agente || !(await bcrypt.compare(password, agente.password))) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ N_Placa: agente.N_Placa, Rango: agente.Rango }, process.env.JWT_SECRET, { expiresIn: '2h' });

    // Agrupar rangos
    let rangoAgrupado;
    if (['jefe de policia', 'jefe adjunto'].includes(agente.Rango.toLowerCase())) {
      rangoAgrupado = 'jefe';
    } else if (agente.Rango.toLowerCase() === 'comandante') {
      rangoAgrupado = 'comandante';
    } else if (['sargento', 'detectivo'].includes(agente.Rango.toLowerCase())) {
      rangoAgrupado = 'sargento/detectivo';
    } else if (agente.Rango.toLowerCase() === 'official') {
      rangoAgrupado = 'official';
    } else {
      return res.status(400).json({ message: 'Rango no reconocido' });
    }

    //Mostrar la informacion del agente
    return res.json({
      token,
      Rango: rangoAgrupado,
      agente
    });
//Linea de error en caso de que no se pueda hacer el login
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});