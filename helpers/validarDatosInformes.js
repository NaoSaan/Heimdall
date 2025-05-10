const validarDatosInformes = (reqb) => {
    const estatus = reqb.Estatus;
    const curp = reqb.Informe_Involucrados.CURP;
    //const num_art = reqb.Informe_Involucrados.Articulos.Num_Art;
    const id_condena = reqb.Informe_Involucrados.Id_Condena;
    const num_placa = reqb.Informe_Agentes.Num_Placa;
    const fecha_informe = reqb.Fecha_Informe;
    const descripcion = reqb.Descripcion;
    const calle = reqb.Direccion.Calle;
    const num_ext = reqb.Direccion.Numero_Exterior;
    const colonia = reqb.Direccion.Colonia;
    const ciudad = reqb.Direccion.Ciudad;
    const estado = reqb.Direccion.Estado;
    const pais = reqb.Direccion.Pais;

    // VALIDACIONES DE ARRAYS Y DATOS ANIDADOS
    if (reqb.Informe_Involucrados) {
        // Validar que sea un array y no esté vacío
        if (!Array.isArray(reqb.Informe_Involucrados) || reqb.Informe_Involucrados.length === 0) {
            return {
                error: 'Debe proporcionar al menos un involucrado',
                isValid: false
            }
        }

        // Validar que Articulos sea un array y no esté vacío para cada involucrado
        const validacionArticulosArray = reqb.Informe_Involucrados.every(inv =>
            inv && inv.Articulos && Array.isArray(inv.Articulos) && inv.Articulos.length > 0
        );

        if (!validacionArticulosArray) {
            return {
                error: 'Cada involucrado debe tener al menos un artículo',
                isValid: false
            }
        }

        // validar que exista un numero de articulo y no esté vacío
        const validacionArticulos = reqb.Informe_Involucrados.every(inv =>
            inv && inv.Articulos && Array.isArray(inv.Articulos) &&
            inv.Articulos.every(art => art && art.Num_Art && art.Num_Art.toString().trim() !== '')
        );

        // validar que el numero de articulo sea un numero entero 
        const validacionNumeroArticulo = reqb.Informe_Involucrados.every(inv =>
            inv && inv.Articulos && Array.isArray(inv.Articulos) &&
            inv.Articulos.every(art => art && !isNaN(parseInt(art.Num_Art)) && Number.isInteger(Number(art.Num_Art)))
        );
        //validar que la curo exita
        const validacionCurp = reqb.Informe_Involucrados.every(inv =>
            inv && inv.CURP);
        //validar que la curo no sea un numero
        const validacionCurpNumero = reqb.Informe_Involucrados.every(inv =>
            inv && inv.CURP &&
            isNaN(Number(inv.CURP))
        );
        //validar que la curo tenga 18 caracteres
        const validacionCurpleght = reqb.Informe_Involucrados.every(inv =>
            inv && inv.CURP &&
            inv.CURP.length === 18
        );
        //validar que exista una condena
        const validacionCondenaid = reqb.Informe_Involucrados.every(inv =>
            inv && inv.Id_Condena);
        //validar que la condena sea un numero entero
        const validacionCondenaidNumero = reqb.Informe_Involucrados.every(inv =>
            inv && inv.Id_Condena &&
            !isNaN(parseInt(inv.Id_Condena)) && Number.isInteger(Number(inv.Id_Condena))
        );

        if (!validacionNumeroArticulo) {
            return {
                error: 'El número de artículo debe ser un número entero',
                isValid: false
            }
        }
        if (!validacionArticulos) {
            return {
                error: 'El involucrado debe tener numero de articulo',
                isValid: false
            }
        }

        if (!validacionCurp) {
            return {
                error: 'El involucrado debe de tener una curp',
                isValid: false
            }
        }

        if (!validacionCurpNumero) {
            return {
                error: 'La CURP no debe ser un número entero',
                isValid: false
            }
        }

        if (!validacionCurpleght) {
            return {
                error: 'La CURP debe tener 18 caracteres',
                isValid: false
            }
        }


        if (!validacionCondenaid) {
            return {
                error: 'El involucrado debe de tener un id de condena',
                isValid: false
            }
        }
        if (!validacionCondenaidNumero) {
            return {
                error: 'El id de la condena debe ser un numero entero',
                isValid: false
            }
        }
    }

    //validar agentes y datos en array
    if (reqb.Informe_Agentes) {
        // Validar que sea un array y no esté vacío
        if (!Array.isArray(reqb.Informe_Agentes) || reqb.Informe_Agentes.length === 0) {
            return {
                error: 'Debe proporcionar al menos un agente',
                isValid: false
            }
        }

        // validar que exista un numero de placa
        const validacionPlaca = reqb.Informe_Agentes.every(ag =>
            ag && ag.Num_Placa && ag.Num_Placa.trim() !== '');

        //validar que el numero de placa no sea un numero
        const validacionPlacaNumero = reqb.Informe_Agentes.every(ag =>
            ag && ag.Num_Placa &&
            isNaN(Number(ag.Num_Placa))
        );

        if (!validacionPlaca) {
            return {
                error: 'El agente debe tener un número de placa válido',
                isValid: false
            }
        }
        if (!validacionPlacaNumero) {
            return {
                error: 'El número de placa no debe ser un número entero',
                isValid: false
            }
        }
    }

    //validacion de foto en array
    if (reqb.Foto) {
        // Validar que sea un array y no esté vacío
        if (!Array.isArray(reqb.Foto) || reqb.Foto.length === 0) {
            return {
                error: 'Debe proporcionar al menos una foto',
                isValid: false
            }
        }

        // validar que exista un url de la foto y no esté vacío
        const validacionFoto = reqb.Foto.every(fo =>
            fo && fo.URL && fo.URL.trim() !== '');

        if (!validacionFoto) {
            return {
                error: 'Todas las fotos deben tener una URL válida',
                isValid: false
            }
        }
    }

    //VALIDACIONES INDIVIDUALE DE DATOS
    //validacion de estatus
    if (!estatus) {
        return {
            error: 'El estatus es requerido',
            isValid: false
        }
    }
    if (estatus !== "A" && estatus !== "C") {
        return {
            error: 'El estatus debe ser A o C',
            isValid: false
        }
    }

    // Validación de fecha de nacimiento
    const fechaInfoDate = new Date(fecha_informe);

    const today = new Date();
    if (isNaN(Date.parse(fecha_informe))) {
        return {
            error: 'La fecha del informe debe tener un formato válido (YYYY-MM-DD)',
            isValid: false
        }
    }
    if (fechaInfoDate > today) {
        return {
            error: 'La fecha del informe no puede ser futura',
            isValid: false
        }
    }

    //validacion de descripcion
    if (!descripcion) {
        return {
            error: 'La descripcion es requerida',
            isValid: false
        }
    }

    //validacion de direccion
    if (!calle) {
        return {
            error: 'La calle es requerida',
            isValid: false
        }
    }
    if (!num_ext) {
        return {
            error: 'El numero exterior es requerido',
            isValid: false
        }
    } else if (isNaN(num_ext)) {
        return {
            error: 'El numero exterior debe ser un numero',
            isValid: false
        }
    }
    if (!colonia) {
        return {
            error: 'La colonia es requerida',
            isValid: false
        }
    }
    if (!ciudad) {
        return {
            error: 'La ciudad es requerida',
            isValid: false
        }
    }
    if (!estado) {
        return {
            error: 'El estado es requerido',
            isValid: false
        }
    }
    if (!pais) {
        return {
            error: 'El pais es requerido',
            isValid: false
        }
    }
    return {
        isValid: true
    }
}

module.exports = {
    validarDatosInformes
}