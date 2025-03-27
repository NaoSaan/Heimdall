const express = require('express');
const router = express.Router();
const Informe = require('../models/Informes'); // Cambiar modelo a Informe
// Obtener informes por número de placa del agente
router.get('/:num_placa', async (req, res) => {
  try {
    const informes = await Informe.find({
       "Informe_Agentes.Num_Placa": req.params.num_placa
    });
    if (informes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron informes' }); 
    }
    res.json(informes);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los informes', error });
  }
});
// Agregar un informe
router.post('/add', async (req, res) => {
  try {
    // Validar que todos los campos requeridos estén presentes
    const estatus = req.body.Estatus;
    const num_placa = req.body.Informe_Agentes.Num_Placa;
    const curp = req.body.Informe_Involucrados.CURP;
    const num_art = req.body.Informe_Involucrados.Articulos.Num_Art;
    const id_condena = parseInt(req.body.Informe_Involucrados.Id_Condena);
    const fecha_informe = req.body.Fecha_Informe;
    const descripcion = req.body.Descripcion;
    const calle = req.body.Direccion.Calle;
    const num_ext = req.body.Direccion.Numero_Exterior;
    const colonia = req.body.Direccion.Colonia;
    const ciudad = req.body.Direccion.Ciudad;
    const estado = req.body.Direccion.Estado;
    const pais = req.body.Direccion.Pais;

    if (estatus.length === 0) {
      return res.status(400).json({ message: 'El estado es requerido' });
    }
    if (estatus !== "A" && estatus !== "C"){
      return res.status(400).json({ message: 'El estatus debe ser A(Abierto) o C(Cerrado)'})
    }
    if (num_placa.length === 0) {
      return res.status(400).json({ message: 'El número de placa es requerido' });
    }
    if (curp.length === 0) {
      return res.status(400).json({ message: 'La CURP es requerida' });
    }else if (curp.length !== 18) {
      return res.status(400).json({ message: 'La CURP debe tener 18 caracteres' });
    }
    if (num_art.length === 0) {
     return res.status(400).json({message: 'El número de artículo es requerido'}); 
    }
    if (id_condena.length === 0) {
      return res.status(400).json({message: 'El id de la condena es requerido'});
    }
    if (isNaN(id_condena)) {
      return res.status(400).json({message: 'El id de la condena debe ser un número'});
    }
    if (fecha_informe.length===0 || isNaN(Date.parse(fecha_informe))) {
      return res.status(400).json({message: 'La fecha de informe debe ser una fecha válida'});
    }
    if (descripcion.length === 0) {
      return res.status(400).json({message: 'La descripción es requerida'});
    }
    if (calle.length === 0) {
      return res.status(400).json({message: 'La calle es requerida'});
    }
    if (num_ext.length === 0) {
      return res.status(400).json({message: 'El número exterior es requerido'});
    } else if (isNaN(num_ext)) {
      return res.status(400).json({message: 'El número exterior debe ser un número'});
    }
    if (colonia.length === 0) {
      return res.status(400).json({message: 'La colonia es requerida'});
   
    }
    if (ciudad.length === 0) {
      return res.status(400).json({message: 'La ciudad es requerida'});
    }
    if (estado.length === 0) {
      return res.status(400).json({message: 'El estado es requerido'});
    }
    if (pais.length === 0) {
      return res.status(400).json({message: 'El país es requerido'}); 
    }
    // Crear un nuevo informe
    const informe = new Informe(req.body);
    await informe.save();
    res.json({ message: 'Informe Agregado', informe });
  } catch (error) {
    console.error('Error validation details:', error.message);
    res.status(400).json({ 
      message: 'Error al agregar el informe', 
      error: error.message 
    });
  }
});
module.exports = router;