const validarDatosCondenas = ({ Fecha_I, Duracion, Importe, Estatus, id_tipocondenaFK, curpFK }) => {
    // Validamos que los campos no sean nulos
    if (!Fecha_I || !Duracion || !Importe || !Estatus || !id_tipocondenaFK || !curpFK) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        };
    }
    // Validación de fecha de nacimiento
    const fechaI = new Date(Fecha_I);
    const today = new Date();

    if (isNaN(Date.parse(fechaI))) {
        return {
            isValid: false,
            error: 'La fecha de inicio de condena debe tener un formato válido (YYYY-MM-DD)'
        };
    }

    if (fechaI > today) {
        return {
            isValid: false,
            error: 'La fecha de inicio de condena no puede ser futura'
        };
    }
    //validar duracion como solo entros
    if (isNaN(Duracion)) {
        return {
            isValid: false,
            error: 'La duracion debe ser un numero entero'
        }
    }
    //validar que el imprte sea un numero tipo numero
    if (isNaN(parseFloat(Importe))) {
        return {
            isValid: false,
            error: 'El importe debe ser una cantidad valida'
        }
    }
    //Validacion: Estatus sea A o P
    if (Estatus != 'A' && Estatus != 'P') {
        return {
            isValid: false,
            error: 'El estatus debe ser A o P'
        }
    }
    if(isNaN(id_tipocondenaFK)){
        return {
            isValid: false,
            error: 'El id del tipo de condena debe ser un numero'
        }
    }
    return {
        isValid: true
    }
    
}

module.exports = {validarDatosCondenas};