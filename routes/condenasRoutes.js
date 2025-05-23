const express = require("express");
const router = express.Router();
const { pool } = require("../config/db");
const { validarDatosCondenas } = require("../helpers/verificarDatosCondenas");

function generateFolio() {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return timestamp + random;
}

// obtener datos de la tabla Condena
router.get("/tipos/all", async (req, res) => {
  try {
    const [rows] = await pool.query("Select * From TipoCondena");
    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la consulta", error);
    res.status(500).json({
      error: "Error al intentar traer la informacion de la base de datos",
    });
  }
});

// obtener datos de la tabla Condena
router.get("/all", async (req, res) => {
  try {
    const [rows] = await pool.query("Select * From Condena");
    res.json(rows);
  } catch (error) {
    console.error("Error al realizar la consulta", error);
    res.status(500).json({
      error: "Error al intentar traer la informacion de la base de datos",
    });
  }
});

//Obtener datos de la tabla Condena por filtro
router.get("/", async (req, res) => {
  try {
    const filtro = req.query.by;

    if (!filtro) {
      return res
        .status(400)
        .json({ error: "Debe proporcionar un texto para buscar" });
    }

    //Obtenermos todas las columnas de la tabla;
    const [columns] = await pool.query("SHOW COLUMNS FROM Condena");

    //Creamos la condicion WHERE para cada columna
    const condicion = columns
      .map((column) => `${column.Field} LIKE ?`)
      .join(" OR ");

    // Creamos la consulta
    const query = `SELECT * FROM Condena WHERE ${condicion}`;

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

// Inserta una nueva condena en MySQL
router.post("/add", async (req, res) => {
  try {
    //validar todos los campos
    const verificarRespuesta = validarDatosCondenas(req.body);
    if (!verificarRespuesta.isValid) {
      return res.status(400).json({
        error: verificarRespuesta.error,
      });
    }
    const { Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK, curpFK } = req.body;

    //Validacion: Tipo de condena exista en la base de datos
    const [existTC] = await pool.query(
      "SELECT * FROM TipoCondena WHERE ID_TipoCondena =?",
      [id_tipocondenaFK]
    );
    if (!existTC.length > 0) {
      return res.status(400).json({
        error: "El tipo de condena no existe en la base de datos",
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

    //Consulta para insertar los datos de la condena donde cada "?" es un campo de la tabla "Condena" en MySQL
    const query = `
            Insert Into Condena (Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK, curpFK) VALUES 
            (?, ?, ?, ?, ?, ?)
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK, curpFK];

    //Ejecucion de la consulta
    const [resultado] = await pool.query(query, values);

    if (resultado.affectedRows === 0) {
      return res.status(500).json({
        error: "Error al insertar la condena en la base de datos",
      });
    }

    const queryC = `
        SELECT SUM(Importe) AS TotalI FROM Condena WHERE curpFK = ? AND Estatus = 'P'
    `;
    const valuesQC = [curpFK];
    const [resB] = await pool.query(queryC, valuesQC);

    // Validamos si existe una busqueda asociada a una curp
    const Exist = async (curp) => {
      const [rows] = await pool.query(
        'SELECT Folio_BC FROM GeneraB WHERE curpFK = ?',
        [curp]
      );
      return rows.length > 0 ? rows[0].Folio_BC : null;
    };

    // Insert o update si la cantidad es mayor a 3000
    if (resB[0].TotalI > 3000) {
      const ChEx = await Exist(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'B' WHERE Folio_BC = ?",
          [resB[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'B', resB[0].TotalI, curpFK]
        );
      }
    }

    // Insert o update si la cantidad es mayor a 7000
    if (resB[0].TotalI > 7000) {
      const ChEx = await Exist(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'M' WHERE Folio_BC = ?",
          [resB[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'M', resB[0].TotalI, curpFK]
        );
      }
    }

    // Insert o update si la cantidad es mayor a 15000
    if (resB[0].TotalI > 15000) {
      const ChEx = await Exist(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'A' WHERE Folio_BC = ?",
          [resB[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'A', resB[0].TotalI, curpFK]
        );
      }
    }

    //Respuesta del servidor
    res.status(201).json({
      message: "Condena agregada exitosamente",
      ID_Condena: resultado.insertId,
      totalImporte: resB[0].totalImporte
    });
  } catch (error) {
    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al insertar la condena:", error);
    res.status(500).json({
      error: "Error al insertar la condena en la base de datos",
    });
  }
});

// Modifica una condena en MySQL
router.put("/update", async (req, res) => {
  try {
    //validar todos los campos
    const verificarRespuesta = validarDatosCondenas(req.body);
    if (!verificarRespuesta.isValid) {
      return res.status(400).json({
        error: verificarRespuesta.error,
      });
    }
    //si todo sale bien, obtenemos los datos de la condena
    const {
      ID_Condena,
      Fecha_I,
      Duracion,
      Importe,
      Estatus,
      id_tipocondenaFK,
      curpFK
    } = req.body;

    // Validamos que los campos no sean nulos
    if (
      (!ID_Condena, !Fecha_I || !Duracion || !Importe || !Estatus || !id_tipocondenaFK || !curpFK)
    ) {
      return res.status(400).json({
        error: "Todos los campos son obligatorios",
      });
    }

    //Validacion: Condena exista en la base de datos
    const [existCondena] = await pool.query(
      "SELECT * FROM Condena WHERE ID_Condena =?",
      [ID_Condena]
    );
    if (!existCondena.length > 0) {
      return res.status(400).json({
        error:
          "La condena que se quiere actualizar no existe en la base de datos",
      });
    }

    //Validacion: Tipo de condena exista en la base de datos
    const [existTC] = await pool.query(
      "SELECT * FROM TipoCondena WHERE ID_TipoCondena =?",
      [id_tipocondenaFK]
    );
    if (!existTC.length > 0) {
      return res.status(400).json({
        error: "El tipo de condena no existe en la base de datos",
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

    //Consulta para modificar los datos de la condena donde cada "?" es un campo de la tabla "Condena" en MySQL
    const query = `
            Update Condena SET 
            Fecha_I =?, Duracion =?, Importe =?, Estatus =?, id_tipocondenaFK=?, curpFK = ? Where ID_Condena =?
        `;

    //Arreglo con los valores pertenecientes a la consulta
    const values = [
      Fecha_I,
      Duracion,
      Importe,
      Estatus,
      id_tipocondenaFK,
      curpFK,
      ID_Condena,
    ];

    //Ejecucion de la consulta
    const [resultado] = await pool.query(query, values);

    if (resultado.affectedRows === 0) {
      return res.status(500).json({
        error: "Error al actualizar la condena en la base de datos",
      });
    }

    const queryCB = `
        SELECT SUM(Importe) AS TotalI FROM Condena WHERE curpFK = ? AND Estatus = 'P'
    `;
    const valuesQCB = [curpFK];
    const [resBU] = await pool.query(queryCB, valuesQCB);

    // Validamos si existe una busqueda asociada a una curp
    const ExistC = async (curp) => {
      const [rows] = await pool.query(
        'SELECT Folio_BC FROM GeneraB WHERE curpFK = ?',
        [curp]
      );
      return rows.length > 0 ? rows[0].Folio_BC : null;
    };

    // Insert o update si la cantidad es mayor a 3000
    if (resBU[0].TotalI < 3000) {
      const ChEx = await ExistC(curpFK);
      if (ChEx) {
        await pool.query(
          "DELETE FROM GeneraB where Folio_BC = ?",
          [ChEx]
        );
      } 
    }

    // Insert o update si la cantidad es mayor a 3000
    if (resBU[0].TotalI > 3000) {
      const ChEx = await ExistC(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'B' WHERE Folio_BC = ?",
          [resBU[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'B', resBU[0].TotalI, curpFK]
        );
      }
    }

    // Insert o update si la cantidad es mayor a 7000
    if (resBU[0].TotalI > 7000) {
      const ChEx = await ExistC(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'M' WHERE Folio_BC = ?",
          [resBU[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'M', resBU[0].TotalI, curpFK]
        );
      }
    }

    // Insert o update si la cantidad es mayor a 15000
    if (resBU[0].TotalI > 15000) {
      const ChEx = await ExistC(curpFK);
      if (ChEx) {
        await pool.query(
          "UPDATE GeneraB SET Cantidad = ?, Clasi = 'A' WHERE Folio_BC = ?",
          [resBU[0].TotalI, ChEx]
        );
      } else {
        const folio = generateFolio();
        await pool.query(
          'INSERT INTO GeneraB (Folio_BC, Clasi, Cantidad, curpFK) VALUES (?, ?, ?, ?)',
          [folio, 'A', resBU[0].TotalI, curpFK]
        );
      }
    }


    //Respuesta del servidor
    res.status(201).json({
      message: "Condena actualizada exitosamente",
    });
  } catch (error) {

    //Si algo no se ejecuta correctamente, mostramos el error en consola
    console.error("Error al actualizar la condena:", error);
    res.status(500).json({
      error: "Error al actualizar la condena en la base de datos",
    });
  }
});

module.exports = router;
