const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

//Obtener todos los datos de la tabla CodigoPenal
router.get('/All', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * From CodigoPenal');
        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
    }
});

//Obtener datos de la tabla por filtro
router.get('/', async (req, res) => {
    try {
        const filtro = req.query.by;
        
        if (!filtro) {
            return res.status(400).json({ error: 'Debe proporcionar un texto para buscar' });
        }

        //Obtenermos todas las columnas de la tabla;
        const [columns] = await pool.query('SHOW COLUMNS FROM codigopenal');
        
        //Creamos la condicion WHERE para cada columna
        const condicion = columns
            .map(column => `${column.Field} LIKE ?`)
            .join(' OR ');
        
        // Creamos la consulta
        const query = `SELECT * FROM codigopenal WHERE ${condicion}`;
        
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

// Inserta un nuevo articulo del codigo penal en MySQL
router.post('/insert', async (req, res) => {
    try {
        const { N_Articulo, NombreArt, Descripcion, Periodo, Importe} = req.body;

        // Validamos que los campos no sean nulos
        if (!N_Articulo || !NombreArt || !Descripcion || !Periodo || !Importe) {
            return res.status(400).json({ 
                error: 'Todos los campos son obligatorios' 
            });
        }

        //Consulta para insertar los datos del articulo donde cada "?" es un campo de la tabla "CodigoPenal" en MySQL
        const query = `
            Insert Into CodigoPenal (N_Articulo, NombreArt, Descripcion, Periodo, Importe) VALUES 
            (?, ?, ?, ?, ?)
        `;

        //Arreglo con los valores pertenecientes a la consulta
        const values = [N_Articulo, NombreArt, Descripcion, Periodo, Importe];

        //Ejecucion de la consulta
        const [] = await pool.query(query, values);

        //Respuesta del servidor
        res.status(201).json({
            message: 'Articulo agregado exitosamente',
        });

    } catch (error) {
        //Si algo no se ejecuta correctamente, mostramos el error en consola 
        console.error('Error al insertar el articulo:', error);
        res.status(500).json({ 
            error: 'Error al insertar el articulo en la base de datos' 
        });
    }
});

router.post('/delete', async (req, res) => {
   try {
        const {N_Articulo} = req.body;

        // Validamos que el campo no sea nulo
        if(!N_Articulo){
            return res.status(400).json({ 
                error: 'Se necesita un ID para eliminar el articulo' 
            });
        }
        
        //Consulta para eliminar los datos del articulo donde "?" es un valor de la base de datos
        const query = `
            Delete From CodigoPenal Where N_Articulo = ?
        `;

       const values = [N_Articulo];

       //Ejecucion de la consulta
       const [] = await pool.query(query, values);

       //Respuesta del servidor
       res.status(201).json({
           message: 'Articulo eliminado exitosamente',
       });

   } catch (error) {
        //Si algo no se ejecuta correctamente, mostramos el error en consola 
        console.error('Error al eliminar el articulo:', error);
        res.status(500).json({ 
            error: 'Error al querer eliminar el articulo de la base de datos' 
        });
   } 
});

module.exports = router;