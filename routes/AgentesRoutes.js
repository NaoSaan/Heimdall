const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const EncryptPWD = require('../helpers/pwdEncriptar.js');
// obtener datos de la tabla agentes
router.get('/All', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * From Agentes');
        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
    }
});
//Crear agente
router.post('/insert', async (req, res) => {

    try {
        const { N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango, pwd } = req.body;

        // Validamos que los campos no sean nulos
        if (!N_Placa || !Nombre || !APaterno || !AMaterno || !Sexo || !Dept || !Rango || !pwd) {
            return res.status(400).json({
                error: 'Todos los campos son obligatorios'
            });
        }
        // Validamos que el N_Placa no exista en la base de datos
        const [existingAgente] = await pool.query('SELECT * FROM agentes WHERE N_Placa = ?', [N_Placa]);
        if (existingAgente.length > 0) {
            return res.status(400).json({
                error: 'El N_Placa ya existe en la base de datos'
            });
        }

        //Validadmos que sexo sea M o F
        if (Sexo != 'M' && Sexo != 'F') {
            return res.status(400).json({
                error: 'El sexo debe ser M o F'
            })
        }
        //PODEMOS VALIDAAR EL DEPARTAMENTO!!!!!!!!!!!!!!!!!!!!!!!
        //Validamos que el rango
        if (Rango.toLowerCase() != "jefe de policia" && Rango.toLowerCase() != "jefe adjunto" && Rango.toLowerCase() != "comandante" && Rango.toLowerCase() != "sargento" && Rango.toLowerCase() != "detective" && Rango.toLowerCase() != "oficial") {
            return res.status(400).json({
                error: 'El rango debe ser jefe de policia, jefe adjunto, comandante, sargento, detective o oficial'
            })
        }

        const pwdEncriptada = await EncryptPWD(pwd);

        //Realizamos el insert
        //Creamos la consulta
        const query = `Insert Into Agentes (N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango, pwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

        //Arreglo con los valores pertenecientes a la consulta
        const values = [N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept.toLowerCase(), Rango.toLowerCase(), pwdEncriptada];

        //Ejecucion de la consulta
        const [] = await pool.query(query, values);

        res.status(201).json({
            message: 'Agente agregado exitosamente',
        });
    } catch (error) {
        console.error('Error al insertar el agente:', error);
        res.status(500).json({
            error: 'Error al insertar el agente en la base de datos'
        });
    }
})
//Obtener datos de la tabla por filtro
router.get('/', async (req, res) => {
    try {
        const filtro = req.query.by;

        if (!filtro) {
            return res.status(400).json({ error: 'Debe proporcionar un texto para buscar' });
        }

        //Obtenermos todas las columnas de la tabla;
        const [columns] = await pool.query('SHOW COLUMNS FROM agentes');

        //Creamos la condicion WHERE para cada columna
        const condicion = columns
            .map(column => `${column.Field} LIKE ?`)
            .join(' OR ');

        // Creamos la consulta
        const query = `SELECT * FROM agentes WHERE ${condicion}`;

        // Preparamos los valores para la consulta
        const values = Array(columns.length).fill(`%${filtro}%`);

        const [rows] = await pool.query(query, values);

        if (rows.length === 0) {
            return res.json({ message: 'No se encontraron resultados para esta búsqueda' });
        }

        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la búsqueda', error);
        res.status(500).json({ error: 'Error al realizar la búsqueda en la base de datos' });
    }
});

module.exports = router;