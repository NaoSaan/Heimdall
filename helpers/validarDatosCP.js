const validarDatosCP = ({ N_Articulo, NombreArt, Descripcion, Periodo_I_Dias,Periodo_F_Dias, Importe }) => {

    // Validamos que los campos no sean nulos
    if (!N_Articulo || !NombreArt || !Descripcion || !Periodo_I_Dias || !Periodo_F_Dias || !Importe) {
        return {
            isValid: false,
            error: 'Todos los campos son obligatorios'
        }
    }

    //Validacion: Importe y N_Articulo no contengan letras
    if (!/^\d+$/.test(N_Articulo)) {
        return {
            isValid: false,
            error: 'El campo Numero de Articulo solo debe contener numeros'
        }
    }

    if (isNaN(parseFloat(Importe))) {
        return {
            isValid: false,
            error: 'El campo Importe solo debe contener numeros'
        }
    }

    if (!/^\d+$/.test(Importe)) {
        return {
            isValid: false,
            error: 'El campo Importe solo debe contener numeros'
        }
    }


    if (isNaN(parseInt(Periodo_I_Dias))) {
        return {
            isValid: false,
            error: 'El campo Periodo Inicial solo debe contener numeros'
        }
    }
    if (!/^\d+$/.test(Periodo_I_Dias)) {
        return {
            isValid: false,
            error: 'El campo Periodo Inicial solo debe contener numeros'
        }
    }


    if (isNaN(parseInt(Periodo_F_Dias))) {
        return {
            isValid: false,
            error: 'El campo Periodo Final solo debe contener numeros'
        }
    }

    if (!/^\d+$/.test(Periodo_I_Dias)) {
        return {
            isValid: false,
            error: 'El campo Periodo Inicial solo debe contener numeros'
        }
    }

    return {
        isValid: true
    }

}

module.exports = {validarDatosCP};