const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { validarDatosCiudadanos } = require("../helpers/validarDatosCiudadanos");

// Obtener datos de la tabla ciudadanos por filtro
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.by;

    if (!filtro) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un texto para buscar" });
    }

    //Obtenermos todas las columnas de la tabla;
    const [columns] = await pool.query("SHOW COLUMNS FROM Ciudadanos");

    //Creamos la condicion WHERE para cada columna
    const condicion = columns
      .map((column) => `${column.Field} LIKE ?`)
      .join(" OR ");

    // Creamos la consulta
    const query = `SELECT * FROM Ciudadanos WHERE ${condicion}`;

    // Preparamos los valores para la consulta
    const values = Array(columns.length).fill(`%${filtro}%`);

    const [rows] = await pool.query(query, values);

    if (rows.length === 0) {
      return res.json({
        message: "No se encontraron resultados para esta búsqueda",
      });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la búsqueda", error);
    res
      .status(500)
      .json({ error: "Error al realizar la búsqueda en la base de datos" });
  }
});

// Obtener datos de la tabla ciudadanos
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query("Select * From Ciudadanos");
    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la consulta", error);
    res.status(500).json({
      error: "Error al intentar traer la informacion de la base de datos",
    });
  }
});

// Inserta un nuevo ciudadano en MySQL
router.post("/add", async (req, res) => {
  try {
    //validamos los datos del ciudadano
    const validationResult = validarDatosCiudadanos(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }

    // si todo salio bien desestructurisamos los datos del ciudadano
    const {
      CURP,
      Nombre,
      APaterno,
      AMaterno,
      FechaNac,
      Sexo,
      Direccion,
      Foto,
      Vive,
    } = req.body;

    //Validacion: CURP no exista en la base de datos
    const [existCiudadano] = await pool.query(
      "SELECT * FROM Ciudadanos WHERE CURP =?",
      [CURP]
    );
    if (existCiudadano.length > 0) {
      return res.status(400).json({
        error: "La CURP ya existe en la base de datos",
      });
    }

    //Consulta para insertar los datos del ciudadano donde cada "?" es un campo de la tabla "Ciudadanos" en MySQL
    const query = `
            Insert Into Ciudadanos (CURP, Nombre, APaterno, AMaterno, FechaNac, Sexo, Direccion, Foto, Vive ) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      CURP,
      Nombre,
      APaterno,
      AMaterno,
      FechaNac,
      Sexo,
      Direccion,
      Foto,
      Vive,
    ];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    //Respuesta del servidor
    res.status(201).json({
      message: "Ciudadano agregado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al insertar el ciudadano:", error);
    res.status(500).json({
      error: "Error al insertar el ciudadano en la base de datos",
    });
  }
});

// Actualiza un ciudadano en MySQL
router.put("/update", async (req, res) => {
  try {
    //validar datos del ciudaddano
    const validationResult = validarDatosCiudadanos(req.body);
    if (!validationResult.isValid) {
      return res.status(400).json({
        error: validationResult.error,
      });
    }

    //si todo esta correcto desestructurisamos los datos del ciudadano
    const {
      CURP,
      Nombre,
      APaterno,
      AMaterno,
      FechaNac,
      Sexo,
      Direccion,
      Foto,
      Vive,
    } = req.body;

    //Validacion: CURP no exista en la base de datos
    const [existCiudadano] = await pool.query(
      "SELECT * FROM Ciudadanos WHERE CURP =?",
      [CURP]
    );
    if (existCiudadano.length <= 0) {
      return res.status(400).json({
        error: "La CURP no existe en la base de datos",
      });
    }

    //Consulta para modificar los datos del ciudadano donde cada "?" es un campo de la tabla "Ciudadanos" en MySQL
    const query = `
            Update Ciudadanos SET 
            Nombre =?, APaterno =?, AMaterno =?, FechaNac =?, Sexo =?, Direccion =?, Foto =?, Vive =? WHERE CURP =?
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      Nombre,
      APaterno,
      AMaterno,
      FechaNac,
      Sexo,
      Direccion,
      Foto,
      Vive,
      CURP,
    ];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    //Respuesta del servidor
    res.status(201).json({
      message: "Ciudadano actualizado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al actualizar el Ciudadano:", error);
    res.status(500).json({
      error: "Error al actualizar el ciudadano en la base de datos",
    });
  }
});

// Elimina un ciudadano
router.delete("/delete", async (req, res) => {
  try {
    const { CURP } = req.body;

    // Validamos que el campo no sea nulo
    if (!CURP) {
      return res.status(400).json({
        error: "Se necesita una CURP para eliminar el ciudadano",
      });
    }

    const [existe] = await pool.query(
      "SELECT * FROM Ciudadanos WHERE CURP = ?",
      [CURP]
    );
    if (existe.length === 0) {
      return res.status(400).json({
        error: "La CURP no existe en la base de datos",
      });
    }
    const [existeVHE] = await pool.query(
      "SELECT * FROM Vehiculos WHERE curpFK = ?",
      [CURP]
    );
    if (existeVHE.length > 0) {
      return res.status(400).json({
        error:
          "La CURP tiene vehiculos relacionados, elimina antes los vehiculos",
      });
    }

    //Consulta para eliminar los datos del ciudadano donde "?" es un valor de la base de datos
    const query = `
             Delete From Ciudadanos Where CURP = ?
         `;

    const values = [CURP];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    //Respuesta del servidor
    res.status(201).json({
      message: "Ciudadano eliminado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al eliminar el ciudadano:", error);
    res.status(500).json({
      error: "Error al querer eliminar el ciudadano de la base de datos",
    });
  }
});

module.exports = router;
