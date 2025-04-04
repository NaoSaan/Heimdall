const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// obtener datos de la tabla Condena
router.get('/All', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * From Condena');
        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
    }
});

//Obtener datos de la tabla Condena por filtro
router.get('/', async (req, res) => {
    try {
        const filtro = req.query.by;
        
        if (!filtro) {
            return res.status(400).json({ error: 'Debe proporcionar un texto para buscar' });
        }

        //Obtenermos todas las columnas de la tabla;
        const [columns] = await pool.query('SHOW COLUMNS FROM condena');
        
        //Creamos la condicion WHERE para cada columna
        const condicion = columns
            .map(column => `${column.Field} LIKE ?`)
            .join(' OR ');
        
        // Creamos la consulta
        const query = `SELECT * FROM condena WHERE ${condicion}`;
        
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

// Inserta una nueva condena en MySQL
router.post('/insert', async (req, res) => {
    try {
        const { Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK} = req.body;

        // Validamos que los campos no sean nulos
        if (!Fecha_I || !Duracion || !Importe || !Estatus || !id_tipocondenaFK) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        //Consulta para insertar los datos de la condena donde cada "?" es un campo de la tabla "Condena" en MySQL
        const query = `
            Insert Into Condena (Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK) VALUES 
            (?, ?, ?, ?, ?)
        `;

        //Arreglo con los valores pertenecientes a la consulta
        const values = [Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK];

        //Ejecucion de la consulta
        const [] = await pool.query(query, values);

        //Respuesta del servidor
        res.status(201).json({
            message: 'Condena agregada exitosamente',
        });

    } catch (error) {
        //Si algo no se ejecuta correctamente, mostramos el error en consola 
        console.error('Error al insertar la condena:', error);
        res.status(500).json({ 
            error: 'Error al insertar la condena en la base de datos' 
        });
    }
});

module.exports = router;