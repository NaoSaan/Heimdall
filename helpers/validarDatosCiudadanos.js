
const validarDatosCiudadanos = ({ CURP, Nombre, APaterno, AMaterno, FechaNac, Sexo, Direccion, Foto, Vive }) => {
    // Validamos que los campos no sean nulos
    if (!Nombre || !APaterno || !AMaterno || !FechaNac || !Sexo || !Direccion || !Foto || !Vive) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        };
    }

    // Regular expression for CURP validation (format: AAAA######AAAAAA##)
    const curpRegex = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[0-9A-Z]\d$/;
    if (!curpRegex.test(CURP)) {
        return {
            isValid: false,
            error: 'La CURP no tiene el formato correcto (formato: AAAA######AAAAAA##)'
        };
    }

    // Regular expression for name validation (only letters, spaces and some special characters)
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    
    if (!nameRegex.test(Nombre)) {
        return {
            isValid: false,
            error: 'El nombre solo debe contener letras'
        };
    } 
    
    if (!nameRegex.test(APaterno)) {
        return {
            isValid: false,
            error: 'El apellido paterno solo debe contener letras'
        };
    } 
    
    if (!nameRegex.test(AMaterno)) {
        return {
            isValid: false,
            error: 'El apellido materno solo debe contener letras'
        };
    }

    // Validación de fecha de nacimiento
    const fechaNacDate = new Date(FechaNac);
    const today = new Date();
    
    if (isNaN(Date.parse(FechaNac))) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento debe tener un formato válido (YYYY-MM-DD)'
        };
    }

    if (fechaNacDate > today) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento no puede ser futura'
        };
    }

    // Validar que la persona tenga una edad razonable menos de 120 años
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120);
    if (fechaNacDate < maxAge) {
        return {
            isValid: false,
            error: 'La fecha de nacimiento no es válida (edad superior a 120 años)'
        };
    }

    //Validacion: Sexo sea M o F
    if (Sexo != 'M' && Sexo != 'F') {
        return {
            isValid: false,
            error: 'El sexo debe ser M o F'
        };
    }

    //Validacion: Vive sea S o N
    if (Vive != 'S' && Vive != 'N') {
        return {
            isValid: false,
            error: 'El campo "Vive" debe ser S o N'
        };
    }

    return {
        isValid: true
    };
}

module.exports = { validarDatosCiudadanos };