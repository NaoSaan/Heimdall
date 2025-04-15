const express = require("express");
const cros = require("cors");
const dotenv = require("dotenv");
const { pool, conectarMongoDB } = require("./config/db");
dotenv.config();
const router = express.Router();

const app = express();
app.use(cros());
app.use(express.json());

//CONEXTAR A MONGODB
conectarMongoDB();

//RUTAS
app.get("/", (req, res) => {
  res.send("¡API funcionando correctamente!");
});
//RUTA PARA LOGIN DE AGENTES
app.use("/api/auth", require("./routes/authRoutes.js"));
//RUTA PARA INFORMES
app.use("/api/informes", require("./routes/informesRoutes.js"));
//RUTA PARA CODIGO PENAL
app.use("/api/codigoPenal", require("./routes/codigopenalRoutes.js"));
//RUTA PARA CIUDADANOS
app.use("/api/ciudadanos", require("./routes/CiudadanosRoutes.js"));
//RUTA PARA AGENTES
app.use("/api/agentes", require("./routes/AgentesRoutes.js"));
//RUTA PARA CONDENAS
app.use("/api/condenas", require("./routes/condenasRoutes.js"));
//RUTA PARA GENERAB
app.use("/api/byc", require("./routes/GeneraBRoutes.js"));
//RUTA PARA VEHICULOS
app.use("/api/vehiculos", require("./routes/VehiculosRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

module.exports = app;
