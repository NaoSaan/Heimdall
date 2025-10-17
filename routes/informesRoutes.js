const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Informe = require('../models/Informes');
const { validarDatosInformes } = require('../helpers/validarDatosInformes');
const fs = require('fs');
const path = require('path');

//configurar multer para subir archivos y guardarlos en la carpeta informe
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Usar una carpeta temporal primero
    const tempPath = path.join(__dirname, '..', 'images', 'temp');
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath, { recursive: true });
    }
    cb(null, tempPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const inform = multer({ storage: storage });


//Obrtener todos los informes por filtro
router.get('/', async (req, res) => {
  try {
    let filtro = req.query.by;
    // quitar espacios
    filtro = filtro ? filtro.replace(/\s/g, '') : '';
    if (!filtro) {
      const informes = await Informe.find({});
      return res.json(informes);
    }

    // Crear el array de condiciones de búsqueda
    const condicionesBusqueda = [
      { _id: mongoose.Types.ObjectId.isValid(filtro) ? filtro : null },
      { Estatus: { $regex: filtro, $options: 'i' } },
      { Descripcion: { $regex: filtro, $options: 'i' } },
      { 'Informe_Agentes.Num_Placa': { $regex: filtro, $options: 'i' } },
      { 'Informe_Involucrados.CURP': { $regex: filtro, $options: 'i' } },
      { 'Informe_Involucrados.Articulos.Num_Art': { $regex: filtro, $options: 'i' } },
      { 'Direccion.Calle': { $regex: filtro, $options: 'i' } },
      { 'Direccion.Colonia': { $regex: filtro, $options: 'i' } },
      { 'Direccion.Ciudad': { $regex: filtro, $options: 'i' } },
      { 'Direccion.Estado': { $regex: filtro, $options: 'i' } },
      { 'Direccion.Pais': { $regex: filtro, $options: 'i' } },
    ];

    // Intentar parsear la fecha
    const fechaPosible = new Date(filtro);
    if (!isNaN(fechaPosible.getTime())) {
      // Si es una fecha válida, agregar condición de búsqueda por fecha
      const inicioDia = new Date(fechaPosible.setHours(0, 0, 0, 0));
      const finDia = new Date(fechaPosible.setHours(23, 59, 59, 999));
      condicionesBusqueda.push({
        Fecha_Informe: {
          $gte: inicioDia,
          $lte: finDia
        }
      });
    }

    const informes = await Informe.find({
      $or: condicionesBusqueda
    });

    if (informes.length === 0) {
      return res.json({ message: 'No se encontraron informes' });
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
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const informes = await Informe.find();

    const informesConUrl = informes.map(informe => {
      const informeObj = informe.toObject();
      if (informeObj.Foto && informeObj.Foto.length > 0) {
        informeObj.Foto = informeObj.Foto.map(foto => ({
          ...foto,
          URL: foto.URL
        }));
      }
      return informeObj;
    });

    res.json(informesConUrl);
  } catch (error) {
    console.error('Error al realizar la consulta', error);
    res.status(500).json({ error: 'Error al intentar traer la informacion de la base de datos' });
  }
});
// Ruta POST /add adaptada
router.post('/add', inform.array('fotos'), async (req, res) => {
  try {
    // Parsear los datos JSON del formulario
    const informeData = req.body.datos ? JSON.parse(req.body.datos) : req.body;

    // Generar un nuevo ID si no viene en los datos
    const informeId = informeData._id || new mongoose.Types.ObjectId();

    // Crear la carpeta final para el informe
    const finalDir = path.join(__dirname, '..', 'images', 'informes', informeId.toString());
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    // Mover los archivos temporales a la ubicación final y preparar las rutas
    const fotosRutas = req.files ? req.files.map(file => {
      const finalPath = path.join(finalDir, file.filename);
      fs.renameSync(file.path, finalPath);
      return {
        URL: `/images/informes/${informeId}/${file.filename}`
      };
    }) : [];

    // Crear el nuevo informe
    const nuevoInforme = new Informe({
      _id: informeId,
      Estatus: informeData.Estatus,
      Fecha_Informe: informeData.Fecha_Informe,
      Descripcion: informeData.Descripcion,
      Direccion: informeData.Direccion,
      Informe_Agentes: informeData.Informe_Agentes,
      Informe_Involucrados: informeData.Informe_Involucrados,
      Foto: fotosRutas
    });

    // Validar los datos del informe
    const validationResult = validarDatosInformes(nuevoInforme);
    if (!validationResult.isValid) {
      // Limpiar: eliminar archivos y carpeta si la validación falla
      if (fs.existsSync(finalDir)) {
        fs.rmSync(finalDir, { recursive: true, force: true });
      }
      return res.status(400).json({ error: validationResult.error });
    }

    // Guardar en la base de datos
    const informeGuardado = await nuevoInforme.save();

    res.status(201).json({
      mensaje: 'Informe creado exitosamente',
      informe: informeGuardado
    });

  } catch (error) {
    console.error('Error al crear el informe:', error);

    // Limpieza en caso de error
    if (req.files) {
      // Eliminar archivos temporales si aún existen
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }

    // Eliminar carpeta del informe si se creó
    const informeId = informeData?._id || (informeData && JSON.parse(req.body.datos)?._id);
    if (informeId) {
      const dirToRemove = path.join(__dirname, '..', 'images', 'informes', informeId.toString());
      if (fs.existsSync(dirToRemove)) {
        fs.rmSync(dirToRemove, { recursive: true, force: true });
      }
    }

    res.status(500).json({
      mensaje: 'Error al procesar el informe',
      error: error.message
    });
  }
});
// Aactualizar un informe
router.put('/update', inform.array('fotos'), async (req, res) => {
  try {
    const informeData = req.body.datos ? JSON.parse(req.body.datos) : req.body;
    const id = informeData._id;

    if (!id) {
      // Limpiar archivos temporales si hay error
      if (req.files) {
        req.files.forEach(file => {
          fs.unlinkSync(file.path);
        });
      }
      return res.status(400).json({ message: "ID del informe no proporcionado" });
    }

    // Mover los archivos a la ubicación final
    const finalDir = path.join(__dirname, '..', 'images', 'informes', id);
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const fotosRutas = req.files ? req.files.map(file => {
      const finalPath = path.join(finalDir, file.filename);
      fs.renameSync(file.path, finalPath);
      return {
        URL: `/images/informes/${id}/${file.filename}`
      };
    }) : [];

    // SE QUITARON LA VALIDACION DE LOS DATOS YA QUE PUEDE QUE EL USUARIO NO AGREGUE NUEVA FOTO,
    // SE PUEDE CREAR OTRA VALIDACION EXCLUSIVA PARA INFORMES UPDATE

    // // Validar que todos los campos requeridos estén presentes
    // const validationResult = validarDatosInformes(informeData);
    // if (!validationResult.isValid) {
    //   return res.status(400).json({
    //     error: validationResult.error
    //   });
    // }

    // Preparar los datos de actualización
    const updateData = {
      ...informeData
    };

    // Si hay nuevas fotos, agregarlas al array existente
    if (fotosRutas.length > 0) {
      const informeExistente = await Informe.findById(id);
      const fotosExistentes = informeExistente.Foto || [];
      updateData.Foto = [...fotosExistentes, ...fotosRutas];
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