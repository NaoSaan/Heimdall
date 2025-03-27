const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');

// GET endpoint to fetch all data from your table
router.get('/getData', async (req, res) => {
    try {
        const [rows] = await pool.query('Select * From GeneraB');
        res.json(rows);
    } catch (error) {
        console.error('Error al realizar la consulta', error);
        res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
    }
});

module.exports = router;