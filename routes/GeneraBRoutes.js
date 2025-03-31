const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

//obtener datos de la tabla GeneraB
router.get('/getData', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * From GeneraB');
        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
    }
});
//obtener datos de la tabla GeneraB por filtro
router.get('/', async (req, res) => {
    try {
        const filtro = req.query.by;
        
        if (!filtro) {
            return res.status(400).json({ error: 'Debe proporcionar un texto para buscar' });
        }

        //Obtenermos todas las columnas de la tabla;
        const [columns] = await pool.query('SHOW COLUMNS FROM generab');
        
        //Creamos la condicion WHERE para cada columna
        const condicion = columns
            .map(column => `${column.Field} LIKE ?`)
            .join(' OR ');
        
        // Creamos la consulta
        const query = `SELECT * FROM generab WHERE ${condicion}`;
        
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

// Inserta una nueva busqueda en MySQL
router.post('/insert', async (req, res) => {
    try {
        const { Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK} = req.body;

        // Validamos que los campos no sean nulos
        if (!Folio_BC || !Clasi || !Cantidad || !curpFK || !id_condenaFK) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        //Consulta para insertar los datos de la busqueda donde cada "?" es un campo de la tabla "GeneraB" en MySQL
        const query = `
            Insert Into GeneraB (Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK) VALUES 
            (?, ?, ?, ?, ?)
        `;

        //Arreglo con los valores pertenecientes a la consulta
        const values = [Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK];

        //Ejecucion de la consulta
        const [] = await pool.query(query, values);

        //Respuesta del servidor
        res.status(201).json({
            message: 'Busqueda agregada exitosamente',
        });

    } catch (error) {
        //Si algo no se ejecuta correctamente, mostramos el error en consola 
        console.error('Error al insertar la busqueda:', error);
        res.status(500).json({ 
            error: 'Error al insertar la busqueda en la base de datos' 
        });
    }
});

module.exports = router;