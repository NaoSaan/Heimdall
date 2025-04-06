const validarDatosCP = ({ N_Articulo, NombreArt, Descripcion, Periodo, Importe }) => {

    // Validamos que los campos no sean nulos
    if (!N_Articulo || !NombreArt || !Descripcion || !Periodo || !Importe) {
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

    return {
        isValid: true
    }

}

module.exports = {validarDatosCP};