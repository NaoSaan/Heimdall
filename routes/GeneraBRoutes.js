const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const {validarByC} = require('../helpers/validarByC');

//obtener datos de la tabla GeneraB
router.get('/all', async (req, res) => {
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
router.post('/add', async (req, res) => {
    try {
        //validamos todos los campos
        const validarResultados = validarByC(req.body);
        if (validarResultados.isValid === false) {
            return res.status(400).json({ error: validarResultados.error });
        }
        //si todo esta correcto, procedemos a insertar los datos
        const { Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK} = req.body;


        //Validacion: CURP exista en la base de datos
        const [existCiudadano] = await pool.query('SELECT * FROM ciudadanos WHERE CURP =?', [curpFK]);
        if (!existCiudadano.length > 0) {
            return res.status(400).json({
                error: 'La CURP no existe en la base de datos'
            });
        }

         //Validacion: Condena no exista en la base de datos
         const [existCondena] = await pool.query('SELECT * FROM Condena WHERE ID_Condena =?', [id_condenaFK]);
         if (!existCondena.length > 0) {
             return res.status(400).json({
                 error: 'La condena no existe en la base de datos'
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
        const [resultados] = await pool.query(query, values);

        if (resultados.affectedRows === 0) {
            return res.status(400).json({
                error: 'Huno error al insertar la busqueda en la base de datos'
            }); 
        }

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

// Modifica busqueda en MySQL
router.put('/update', async (req, res) => {
    try {
        //valiadamos todos los campos
        const validarResultados = validarByC(req.body);
        if (validarResultados.isValid === false) {
            return res.status(400).json({ error: validarResultados.error });
        }
        //si todo esta correcto, procedemos a actualizar los datos
        const { Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK} = req.body;

        //Validacion: Busqueda exista en la base de datos
        const [existBusqueda] = await pool.query('SELECT * FROM GeneraB WHERE Folio_BC =?', [Folio_BC]);
        if (!existBusqueda.length > 0) {
            return res.status(400).json({
                error: 'La busqueda que se quiere actualizar no existe en la base de datos'
            });
        }

        //Validacion: CURP exista en la base de datos
        const [existCiudadano] = await pool.query('SELECT * FROM ciudadanos WHERE CURP =?', [curpFK]);
        if (!existCiudadano.length > 0) {
            return res.status(400).json({
                error: 'La CURP no existe en la base de datos'
            });
        }

         //Validacion: Condena no exista en la base de datos
         const [existCondena] = await pool.query('SELECT * FROM Condena WHERE ID_Condena =?', [id_condenaFK]);
         if (!existCondena.length > 0) {
             return res.status(400).json({
                 error: 'La condena no existe en la base de datos'
             });
         }

        //Consulta para insertar los datos de la busqueda donde cada "?" es un campo de la tabla "GeneraB" en MySQL
        const query = `
            update GeneraB set 
            Clasi=?, Cantidad=?, curpFK=?, id_condenaFK=? where Folio_BC=?
        `;

        //Arreglo con los valores pertenecientes a la consulta
        const values = [Clasi, Cantidad, curpFK, id_condenaFK, Folio_BC];

        //Ejecucion de la consulta
        const [resultados] = await pool.query(query, values);

        if (resultados.affectedRows === 0) {
            return res.status(400).json({
                error: 'Huno error al actualizar la busqueda en la base de datos'
            });
        }

        //Respuesta del servidor
        res.status(201).json({
            message: 'Busqueda actualizada exitosamente',
        });

    } catch (error) {
        //Si algo no se ejecuta correctamente, mostramos el error en consola 
        console.error('Error al actualizar la busqueda:', error);
        res.status(500).json({ 
            error: 'Error al actualizar la busqueda en la base de datos' 
        });
    }
});

module.exports = router;