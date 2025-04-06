const validarDatosVehiculos = ({ Matricula, Modelo, Marca, Año, Tipo, Descripcion, Nacionalidad, curpFK }) => {
    // Validamos que los campos no sean nulos
    if (!Matricula || !Modelo || !Marca || !Año || !Tipo || !Descripcion || !Nacionalidad || !curpFK) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        }
    }

    //Validacion: Matricula posea 7 caracteres
    if (Matricula.length != 7) {
        return {
            isValid: false,
            error: 'La matricula debe tener 7 caracteres'
        }
    }
    //validar año del vehiculo
    if(isNaN(parseInt(Año))){
        return {
            isValid: false,
            error: 'El año del vehiculo debe ser un numero' 
        }
    }
    //validar tipo del vehiculo
    if(Tipo!="Automovil" && Tipo!="Camioneta"){
        return {
            isValid: false,
            error: 'El tipo del vehiculo debe ser Automovil o Camioneta'
        }
    }
    // Regular expression for CURP validation (format: AAAA######AAAAAA##)
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
    if (!curpRegex.test(curpFK)) {
        return {
            isValid: false,
            error: 'La CURP no tiene el formato correcto (formato: AAAA######AAAAAA##)'
        };
    }

    return {
        isValid: true,
    }

}

module.exports = {
    validarDatosVehiculos
}