const mongoose = require('mongoose');

const informesSchema = new mongoose.Schema({
  id: { type: String, required: true },
  Estatus: { type: String, required: true },
  informe_involucrados: { 
    CURP: { type: String, required: true },
    Articulos:{
        Num_Art:{type: String, required: true},
    },
    Id_Condena: {type: String, required: true},
  },
  Agentes_Informe: {
    Num_Placa: { type: String, required: true },
  },
  Fecha_Informe: { type: Date, required: true },
  Descripcion: { type: String, required: true },
  Foto:{
    URL: { type: String, required: true },
  },
  Direccion: {
    Calle: { type: String, required: true },
    Colonia: { type: String, required: true },
    Numero_Exterior: { type: String, required: true },
    Ciudad: { type: String, required: true },
    Estado: { type: String, required: true },
    Pais: { type: String, required: true },
  },
});

module.exports = mongoose.model('Informes', informesSchema);