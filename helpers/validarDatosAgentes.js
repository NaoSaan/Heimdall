const validarDatosAgentes = ({N_Placa,Nombre,APaterno,AMaterno,Sexo,Dept,Rango,pwd}) => {
    // Validamos que los campos no sean nulos
    if (!N_Placa || !Nombre || !APaterno || !AMaterno || !Sexo || !Dept || !Rango || !pwd) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        }
    }
    const nameRegex = /^[A-Za-zÀ-ÿ\s]+$/;
    if (!nameRegex.test(Nombre)) {
        return {
            isValid: false,
            error: 'El nombre solo debe contener letras'
        }
    }
    if (!nameRegex.test(APaterno)) {
        return {
            isValid: false,
            error: 'El apellido paterno solo debe contener letras'
        }
    }
    if (!nameRegex.test(AMaterno)) {
        return {
            isValid: false,
            error: 'El apellido materno solo debe contener letras'
        }
    }
    if (!nameRegex.test(Dept)) {
        return {
            isValid: false,
            error: 'El departamento solo debe contener letras'
        }
    }
    //VALIDAR QUE N_Placa, Nombre, APaterno, AMaterno NO SEAN NUMEROS
    if (!isNaN(parseInt(N_Placa))){
        return {
            isValid: false,
            error: 'El numero de placa solo debe contener letras'
        }
    }

    //Validadmos que sexo sea M o F
    if (Sexo != 'M' && Sexo != 'F') {
        return {
            isValid: false,
            error: 'El sexo solo debe ser M o F'
        }
    }

    //Validamos que el rango
    if (Rango.toLowerCase() != "jefe de policia" && Rango.toLowerCase() != "jefe adjunto" && Rango.toLowerCase() != "comandante" && Rango.toLowerCase() != "sargento" && Rango.toLowerCase() != "detective" && Rango.toLowerCase() != "oficial") {
        return {
            isValid: false,
            error: 'El rango solo debe ser Jefe de Policia, Jefe Adjunto, Comandante, Sargento, Detective o Oficial'
        }
    }
    return {
        isValid: true,
    }
}

module.exports = {
    validarDatosAgentes
}