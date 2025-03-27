const express = require('express');
const router = express.Router();
const Informe = require('../models/Informe'); // Cambiar modelo a Informe
// Obtener informes por número de placa del agente
router.get('/:num_placa', async (req, res) => {
  try {
    const informes = await Informe.find({ 
      "Agentes_Informe.Num_Placa": req.params.num_placa 
    });
    res.json(informes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los informes', error });
  }
});
// Agregar un pago (solo admin)
router.post('/agregar', async (req, res) => {
 const pago = new Pago(req.body);
 await pago.save();
 res.json({ message: 'Pago agregado', pago });
});
module.exports = router;