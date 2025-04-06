const validarByC = ({ Folio_BC, Clasi, Cantidad, curpFK, id_condenaFK }) => {
    // Validamos que los campos no sean nulos
    if (!Folio_BC || !Clasi || !Cantidad || !curpFK || !id_condenaFK) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        }
    }
    //validar folio_BC sea un numero
    if (isNaN(parseInt(Folio_BC))) {
        return {
            isValid: false,
            error: 'El folio debe ser un numero'
        }
    }
    //Validacion: Clasificacion sea M, A o B
    if (Clasi != 'M' && Clasi != 'A' && Clasi != 'B') {
        return {
            isValid: false,
            error: 'La clasificacion debe ser M, A o B'
        }
    }
    //validar que cantidad sea un numero
    if (isNaN(parseInt(Cantidad))) {
        return {
            isValid: false,
            error: 'La cantidad debe ser un numero'
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
    //validar que id_condenaFK sea un numero
    if (isNaN(parseInt(id_condenaFK))) {
        return {
            isValid: false,
            error: 'El id de la condena debe ser un numero'
        }
    }
    return {
        isValid: true
    }
}

module.exports = {validarByC};