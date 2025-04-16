const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { validarDatosVehiculos } = require("../helpers/validarDatosVehiculo");

// Obtener datos de la tabla Vehiculos
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query("Select * From Vehiculos");
    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la consulta", error);
    res
      .status(500)
      .json({
        error: "Error al intentar traer la informacion de la base de datos",
      });
  }
});
//Obtener datos de la tabla Vehiculos por filtro
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.by;

    if (!filtro) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un texto para buscar" });
    }

    //Obtenermos todas las columnas de la tabla;
    const [columns] = await pool.query("SHOW COLUMNS FROM Vehiculos");

    //Creamos la condicion WHERE para cada columna
    const condicion = columns
      .map((column) => `${column.Field} LIKE ?`)
      .join(" OR ");

    // Creamos la consulta
    const query = `SELECT * FROM Vehiculos WHERE ${condicion}`;

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

// Inserta un nuevo vehiculo en MySQL
router.post("/add", async (req, res) => {
  try {
    //validamos todos los campos
    const validarResultado = validarDatosVehiculos(req.body);
    if (!validarResultado.isValid) {
      return res.status(400).json({ error: validarResultado.error });
    }
    //Obtenemos los datos del vehiculo
    const {
      Matricula,
      Modelo,
      Marca,
      Año,
      Tipo,
      Descripcion,
      Nacionalidad,
      curpFK,
    } = req.body;

    //Validacion: Matricula no exista en la base de datos
    const [existVehiculo] = await pool.query(
      "SELECT * FROM Vehiculos WHERE Matricula =?",
      [Matricula]
    );
    if (existVehiculo.length > 0) {
      return res.status(400).json({
        error: "El vehiculo ya existe en la base de datos",
      });
    }

    //Validacion: CURP exista en la base de datos
    const [existCiudadano] = await pool.query(
      "SELECT * FROM Ciudadanos WHERE CURP =?",
      [curpFK]
    );
    if (!existCiudadano.length > 0) {
      return res.status(400).json({
        error: "La CURP no existe en la base de datos",
      });
    }

    //Consulta para insertar los datos del vehiculo donde cada "?" es un campo de la tabla "Vehiculos" en MySQL
    const query = `
            Insert Into Vehiculos (Matricula, Modelo, Marca, Año, Tipo, Descripcion, Nacionalidad, curpFK) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?)
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      Matricula,
      Modelo,
      Marca,
      Año,
      Tipo,
      Descripcion,
      Nacionalidad,
      curpFK,
    ];

    //Ejecucion de la consulta
    const [resultados] = await pool.query(query, values);

    if (resultados.affectedRows === 0) {
      return res.status(400).json({
        error: "Hubo un problema en la base de datos al agregar el vehiculo",
      });
    }

    //Respuesta del servidor
    res.status(201).json({
      message: "Vehiculo agregado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al insertar el vehiculo:", error);
    res.status(500).json({
      error: "Error al insertar el vehiculo en la base de datos",
    });
  }
});

//Elimina un vehiculo de MySQL
router.delete("/delete", async (req, res) => {
  try {
    const { Matricula } = req.body;

    // Validamos que el campo no sea nulo
    if (!Matricula) {
      return res.status(400).json({
        error: "Se necesita una matricula para eliminar el vehiculo",
      });
    }

    //Consulta para eliminar los datos del vehiculo donde "?" es un valor de la base de datos
    const query = `
             Delete From Vehiculos Where Matricula = ?
         `;

    const values = [Matricula];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    //Respuesta del servidor
    res.status(201).json({
      message: "Vehiculo eliminado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al eliminar el vehiculo:", error);
    res.status(500).json({
      error: "Error al querer eliminar el vehiculo de la base de datos",
    });
  }
});

// Modifica un vehiculo en MySQL
router.put("/update", async (req, res) => {
  try {
    //validamos todos los campos
    const validarResultado = validarDatosVehiculos(req.body);
    if (!validarResultado.isValid) {
      return res.status(400).json({ error: validarResultado.error });
    }
    //si todo sale bien, obtenemos los datos del vehiculo
    const {
      Matricula,
      Modelo,
      Marca,
      Año,
      Tipo,
      Descripcion,
      Nacionalidad,
      curpFK,
    } = req.body;

    //Validacion: Vehiculo exista en la base de datos
    const [existVehiculo] = await pool.query(
      "SELECT * FROM Vehiculos WHERE Matricula =?",
      [Matricula]
    );
    if (!existVehiculo.length > 0) {
      return res.status(400).json({
        error:
          "El vehiculo que se quiere actualizar no existe en la base de datos",
      });
    }

    //Validacion: CURP exista en la base de datos
    const [existCiudadano] = await pool.query(
      "SELECT * FROM Ciudadanos WHERE CURP =?",
      [curpFK]
    );
    if (!existCiudadano.length > 0) {
      return res.status(400).json({
        error: "La CURP no existe en la base de datos",
      });
    }

    //Consulta para modificar los datos del vehiculo donde cada "?" es un campo de la tabla "Vehiculos" en MySQL
    const query = `
            Update Vehiculos Set
            Modelo =?, Marca =?, Año =?, Tipo =?, Descripcion =?, Nacionalidad =?, curpFK =? Where Matricula =?
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      Modelo,
      Marca,
      Año,
      Tipo,
      Descripcion,
      Nacionalidad,
      curpFK,
      Matricula,
    ];

    //Ejecucion de la consulta
    const [resultados] = await pool.query(query, values);

    if (resultados.affectedRows === 0) {
      return res.status(400).json({
        error: "Hubo un problema en la base de datos al actualizar el vehiculo",
      });
    }
    //Respuesta del servidor
    res.status(201).json({
      message: "Vehiculo actualizado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al actualizar el vehiculo:", error);
    res.status(500).json({
      error: "Error al actualizar el vehiculo en la base de datos",
    });
  }
});

module.exports = router;
