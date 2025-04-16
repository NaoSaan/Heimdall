const express = require("express");
const router = express.Router();
const { pool } = require("../config/db.js");
const EncryptPWD = require("../helpers/pwdEncriptar.js");
const { validarDatosAgentes } = require("../helpers/validarDatosAgentes.js");

//Obtener datos de la tabla por filtro
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.by;

    if (!filtro) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un texto para buscar" });
    }

    //Obtenermos todas las columnas de la tabla;
    const [columns] = await pool.query("SHOW COLUMNS FROM Agentes");

    //Creamos la condicion WHERE para cada columna
    const condicion = columns
      .map((column) => `${column.Field} LIKE ?`)
      .join(" OR ");

    // Creamos la consulta
    const query = `SELECT * FROM Agentes WHERE ${condicion}`;

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

// obtener datos de la tabla agentes
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query("Select * From Agentes");
    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la consulta", error);
    res.status(500).json({
      error: "Error al intentar traer la informacion de la base de datos",
    });
  }
});
//Crear agente
router.post("/add", async (req, res) => {
  try {
    //validar los campos
    const validarResultado = validarDatosAgentes(req.body);
    if (!validarResultado.isValid) {
      return res.status(400).json({
        error: validarResultado.error,
      });
    }

    //si todo sale bien, continuamos con una ultima validacion
    const { N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango, pwd } =
      req.body;

    // Validamos que el N_Placa no exista en la base de datos
    const [existingAgente] = await pool.query(
      "SELECT * FROM Agentes WHERE N_Placa = ?",
      [N_Placa]
    );
    if (existingAgente.length > 0) {
      return res.status(400).json({
        error: "El N_Placa ya existe en la base de datos",
      });
    }
    //ENCRIPTACION DE LA CONTRASEÑA
    const pwdEncriptada = await EncryptPWD(pwd);

    //Realizamos el insert
    //Creamos la consulta
    const query = `Insert Into Agentes (N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango, pwd) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      N_Placa,
      Nombre,
      APaterno,
      AMaterno,
      Sexo,
      Dept.toLowerCase(),
      Rango.toLowerCase(),
      pwdEncriptada,
    ];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    res.status(201).json({
      message: "Agente agregado exitosamente",
    });
  } catch (error) {
    console.error("Error al insertar el agente:", error);
    res.status(500).json({
      error: "Error al insertar el agente en la base de datos",
    });
  }
});
//actualizar agente
router.put("/update", async (req, res) => {
  try {
    //validar los datos
    const validarResultado = validarDatosAgentes(req.body);
    if (!validarResultado.isValid) {
      return res.status(400).json({
        error: validarResultado.error,
      });
    }

    //si todo sale bien, continuamos con una ultima validacion
    const { N_Placa, Nombre, APaterno, AMaterno, Sexo, Dept, Rango, pwd } =
      req.body;

    //comprobamos que el N_Placa exista en la base de datos
    const [existingAgente] = await pool.query(
      "SELECT * FROM Agentes WHERE N_Placa =?",
      [N_Placa]
    );
    if (existingAgente.length === 0) {
      return res.status(404).json({
        error: "El N_Placa no existe en la base de datos",
      });
    }

    //encriptar nuerva contraseña
    const pwdEncriptada = await EncryptPWD(pwd);

    //Realizamos el update
    //creamos la consulta
    const query = `UPDATE Agentes SET Nombre = ?, APaterno = ?, AMaterno = ?, Sexo = ?, Dept = ?, Rango = ?, pwd = ? WHERE N_Placa = ?`;
    //creamos los valores
    const values = [
      Nombre,
      APaterno,
      AMaterno,
      Sexo,
      Dept.toLowerCase(),
      Rango.toLowerCase(),
      pwdEncriptada,
      N_Placa,
    ];
    //ejecutamos la consulta
    const [resultado] = await pool.query(query, values);
    if (resultado.affectedRows === 0) {
      return res.status(404).json({
        error: "No se puedo realizar la actualizacion",
      });
    }
    res.status(200).json({
      message: "Agente actualizado exitosamente",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "Error al actualizar el agente en la base de datos",
    });
  }
});

//eliminar agente
router.delete("/delete", async (req, res) => {
  try {
    const { N_Placa } = req.body;

    // Validamos que el campo no sea nulo
    if (!N_Placa) {
      return res.status(400).json({
        error: "Se necesita un numero de placa para eliminar el agente",
      });
    }
    if (!isNaN(parseInt(N_Placa))) {
      return res.status(400).json({
        error:
          "El campo N_Placa debe ser una cadena de texto, no un valor numerico",
      });
    }

    const [existingAgente] = await pool.query(
      "SELECT * FROM Agentes WHERE N_Placa = ?",
      [N_Placa]
    );
    if (existingAgente.length === 0) {
      return res.status(400).json({
        error: "El N_Placa no existe en la base de datos",
      });
    }

    //Consulta para eliminar los datos del agente donde "?" es un valor de la base de datos
    const query = `
             Delete From Agentes Where N_Placa = ?
         `;

    const values = [N_Placa];

    //Ejecucion de la consulta
    const [] = await pool.query(query, values);

    //Respuesta del servidor
    res.status(201).json({
      message: "Agente eliminado exitosamente",
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al eliminar el agente:", error);
    res.status(500).json({
      error: "Error al querer eliminar el agente de la base de datos",
    });
  }
});

module.exports = router;
