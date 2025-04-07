const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Informe = require('../models/Informes'); // Cambiar modelo a Informe
const { validarDatosInformes } = require('../helpers/validarDatosInformes'); // Cambiar validacion a Informe

//Obrtener todos los informes por filtro
router.get('/', async (req, res) => {
  try {
    const filtro = req.query.by;

    if (!filtro) {
      const informes = await Informe.find({});
      return res.json(informes);
    }

    const informes = await Informe.find({
      $or: [
        { Estatus: { $regex: filtro, $options: 'i' } },
        { Descripcion: { $regex: filtro, $options: 'i' } },
        { 'Informe_Agentes.Num_Placa': { $regex: filtro, $options: 'i' } },
        { 'Informe_Involucrados.CURP': { $regex: filtro, $options: 'i' } },
        { 'Informe_Involucrados.Articulos.Num_Art': { $regex: filtro, $options: 'i' } },
        { 'Direccion.Calle': { $regex: filtro, $options: 'i' } },
        { 'Direccion.Colonia': { $regex: filtro, $options: 'i' } },
        { 'Direccion.Ciudad': { $regex: filtro, $options: 'i' } },
        { 'Direccion.Estado': { $regex: filtro, $options: 'i' } },
        { 'Direccion.Pais': { $regex: filtro, $options: 'i' } }
      ]
    });

    if (informes.length === 0) {
      return res.status(404).json({ message: 'No se encontraron informes' });
    }

    res.json(informes);
  } catch (error) {
    console.error('Error al realizar la búsqueda', error);
    res.status(500).json({ message: 'Error al obtener los informes', error });
  }
});
// Obtener informes
router.get('/all', async (req, res) => {
  try {
    const informes = await Informe.find();
    res.json(informes);
  } catch (error) {
    console.error('Error al realizar la consulta', error);
    res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
  }
});
// Agregar un informe
router.post('/add', async (req, res) => {

  try {
    // Validar que todos los campos requeridos estén presentes
    const validationResult = validarDatosInformes(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: validationResult.error
      });
    }
    //si todo sale bien procedemos a agregar el informe
    const {Estatus,Informe_Involucrados,Informe_Agentes,Fecha_Informe,Descripcion,Foto,Direccion} = req.body;
    //generamos id de mongo
    const idgenerated = new mongoose.Types.ObjectId();
    // Crear un nuevo informe
    const informe = new Informe({ _id: idgenerated, 
      Estatus,
      Informe_Involucrados,
      Informe_Agentes,
      Fecha_Informe,
      Descripcion,
      Foto,
      Direccion
    });
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
// Aactualizar un informe
router.put('/update', async (req, res) => {
  try {
    const id = req.body._id; // ID del documento a actualizar

    const updateData = req.body; // Datos a actualizar

    if (!id) {
      return res.status(400).json({ message: "ID del informe no proporcionado" }); 
    }
    // Validar que todos los campos requeridos estén presentes
    const validationResult = validarDatosInformes(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: validationResult.error
      });
    }

    // Actualizar el documento
    const informeActualizado = await Informe.findByIdAndUpdate(
      id,
      updateData,
      { new: true } // Devuelve el documento actualizado
    );

    if (!informeActualizado) {
      return res.status(404).json({ message: "Informe no encontrado" });
    }

    res.json({ message: 'Informe Actualizado', informeActualizado });
  } catch (error) {
    console.error('Error validation details:', error.message);
    res.status(400).json({
      message: 'Error al actualizar el informe',
      error: error.message
    });
  }
});
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

module.exports = router;