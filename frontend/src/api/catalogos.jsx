import axios from "axios";
import Cookies from 'universal-cookie';

// endpoints de catálogos
// const BASE_URL = 'http://132.248.51.138:8000'; // http://localhost:8000
const BASE_URL = 'http://127.0.0.1:8000';
const cookies  = new Cookies();

const HOSPITAL_URL        = '/catalogos/get_hospital/';
const HOSPITALS_URL       = '/catalogos/get_hospitales/';
const INSERT_HOSPITAL_URL = '/catalogos/set_hospital/';
const EDIT_HOSPITAL_URL   = '/catalogos/set_hospital/';
const DELETE_HOSPITAL_URL = '/catalogos/delete_hospital/';

const CONSTANTEVITAL_URL        = '/catalogos/get_constante_vital/';
const CONSTANTESVITALES_URL     = '/catalogos/get_constantes_vitales/';
const INSERT_CONSTANTEVITAL_URL = '/catalogos/set_constante_vital/';
const EDIT_CONSTANTEVITAL_URL   = '/catalogos/set_constante_vital/';
const DELETE_CONSTANTEVITAL_URL = '/catalogos/delete_constante_vital/';

const SINTOMA_URL        = '/catalogos/get_sintoma/';
const SINTOMAS_URL       = '/catalogos/get_sintomas/';
const INSERT_SINTOMA_URL = '/catalogos/set_sintoma/';
const EDIT_SINTOMA_URL   = '/catalogos/set_sintoma/';
const DELETE_SINTOMA_URL = '/catalogos/delete_sintoma/';

const ANTECEDENTE_URL        = '/catalogos/get_antecedente/';
const ANTECEDENTES_URL       = '/catalogos/get_antecedentes/';
const INSERT_ANTECEDENTE_URL = '/catalogos/set_antecedente/';
const EDIT_ANTECEDENTE_URL   = '/catalogos/set_antecedente/';
const DELETE_ANTECEDENTE_URL = '/catalogos/delete_antecedente/';

const ESPECIALIDAD_URL        = '/catalogos/get_especialidad/';
const ESPECIALIDADES_URL      = '/catalogos/get_especialidades/';
const INSERT_ESPECIALIDAD_URL = '/catalogos/set_especialidad/';
const EDIT_ESPECIALIDAD_URL   = '/catalogos/set_especialidad/';
const DELETE_ESPECIALIDAD_URL = '/catalogos/delete_especialidad/';

const ESTADOALERTA_URL        = '/catalogos/get_estado_alerta/';
const ESTADOSALERTA_URL       = '/catalogos/get_estados_alertas/';
const INSERT_ESTADOALERTA_URL = '/catalogos/set_estado_alerta/';
const EDIT_ESTADOALERTA_URL   = '/catalogos/set_estado_alerta/';
const DELETE_ESTADOALERTA_URL = '/catalogos/delete_estado_alerta/';

const VACUNA_URL              = '/catalogos/get_vacuna/';
const VACUNAS_URL             = '/catalogos/get_vacunas/';
const INSERT_VACUNA_URL       = '/catalogos/set_vacuna/';
const EDIT_VACUNA_URL         = '/catalogos/set_vacuna/';
const DELETE_VACUNA_URL       = '/catalogos/delete_vacuna/';

const MEDICAMENTO_URL              = '/catalogos/get_medicamento/';
const MEDICAMENTOS_URL             = '/catalogos/get_medicamentos/';
const INSERT_MEDICAMENTO_URL       = '/catalogos/set_medicamento/';
const EDIT_MEDICAMENTO_URL         = '/catalogos/set_medicamento/';
const DELETE_MEDICAMENTO_URL       = '/catalogos/delete_medicamento/';

const MOTIVOALTA_URL              = '/catalogos/get_motivo_alta/';
const MOTIVOSALTA_URL             = '/catalogos/get_motivos_alta/';
const INSERT_MOTIVOALTA_URL       = '/catalogos/set_motivo_alta/';
const EDIT_MOTIVOALTA_URL         = '/catalogos/set_motivo_alta/';
const DELETE_MOTIVOALTA_URL       = '/catalogos/delete_motivo_alta/';

const TERAPEUTICA_URL        = '/catalogos/get_terapeutica/';
const TERAPEUTICAS_URL       = '/catalogos/get_terapeuticas/';
const INSERT_TERAPEUTICA_URL = '/catalogos/set_terapeutica/';
const EDIT_TERAPEUTICA_URL   = '/catalogos/set_terapeutica/';
const DELETE_TERAPEUTICA_URL = '/catalogos/delete_terapeutica/';

const ROLES_URL = '/catalogos/get_roles/';


// obtener un listado de todos los roles de usuario registrados
export const get_roles = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: ROLES_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

//////////////////////////// INICIO HOSPITALES ////////////////////////////
// obtener listado de todos los hospitales registrados
export const get_hospitales = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: HOSPITALS_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un hospital en específico
export const get_hospital = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: HOSPITAL_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar hospital elegido
export const delete_hospital = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_HOSPITAL_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar hospital elegido
export const edit_hospital = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_HOSPITAL_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo hospital
export const insert_hospital = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_HOSPITAL_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN HOSPITALES ////////////////////////////



//////////////////////////// INICIO CONSTANTES VITALES ////////////////////////////
// obtener listado de todas las constantes vitales registradas
export const get_constantesvitales = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: CONSTANTESVITALES_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de una constante vital en específico
export const get_constantevital = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: CONSTANTEVITAL_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar constante vital elegida
export const delete_constantevital = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_CONSTANTEVITAL_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar constante vital elegida
export const edit_constantevital = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_CONSTANTEVITAL_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nueva constante vital
export const insert_constantevital = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_CONSTANTEVITAL_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN CONSTANTES VITALES ////////////////////////////



//////////////////////////// INICIO SÍNTOMAS ////////////////////////////
// obtener listado de todos los síntomas registrados
export const get_sintomas = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: SINTOMAS_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un síntoma en específico
export const get_sintoma = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: SINTOMA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar síntoma elegido
export const delete_sintoma = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_SINTOMA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar síntomas elegido
export const edit_sintoma = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_SINTOMA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo síntoma
export const insert_sintoma = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_SINTOMA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN SÍNTOMAS ////////////////////////////



//////////////////////////// INICIO ANTECEDENTES ////////////////////////////
// obtener listado de todos los antecedentes registrados
export const get_antecedentes = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: ANTECEDENTES_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un antecedente en específico
export const get_antecedente = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: ANTECEDENTE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar antecedente elegido
export const delete_antecedente = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_ANTECEDENTE_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar antecedentes elegido
export const edit_antecedente = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_ANTECEDENTE_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo antecedente
export const insert_antecedente = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_ANTECEDENTE_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN ANTECEDENTES ////////////////////////////



//////////////////////////// INICIO ESPECIALIDADES ////////////////////////////
// obtener listado de todas las especialidades registradas
export const get_especialidades = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: ESPECIALIDADES_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de una especialidad en específico
export const get_especialidad = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: ESPECIALIDAD_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar especialidad elegida
export const delete_especialidad = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_ESPECIALIDAD_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar especialidad elegida
export const edit_especialidad = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_ESPECIALIDAD_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nueva especialidad
export const insert_especialidad = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_ESPECIALIDAD_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN ESPECIALIDADES ////////////////////////////



//////////////////////////// INICIO ESTADOS ALERTA ////////////////////////////
// obtener listado de todos los estados de alerta registrados
export const get_estadosAlerta = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: ESTADOSALERTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un estado de alerta en específico
export const get_estadoAlerta = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: ESTADOALERTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar estado de alerta elegido
export const delete_estadoAlerta = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_ESTADOALERTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar estado de alerta elegido
export const edit_estadoAlerta = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_ESTADOALERTA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo estado de alerta
export const insert_estadoAlerta = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_ESTADOALERTA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN ESTADOS ALERTA ////////////////////////////





//////////////////////////// INICIO VACUNAS ////////////////////////////
// obtener listado de todas las vacunas registradas
export const get_vacunas = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: VACUNAS_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de una vacuna en específico
export const get_vacuna = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: VACUNA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar vacuna elegida
export const delete_vacuna = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_VACUNA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar vacuna elegida
export const edit_vacuna = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_VACUNA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nueva vacuna
export const insert_vacuna = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_VACUNA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN VACUNAS ////////////////////////////





//////////////////////////// INICIO MEDICAMENTOS ////////////////////////////
// obtener listado de todos los medicamentos registrados
export const get_medicamentos = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: MEDICAMENTOS_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un medicamento en específico
export const get_medicamento = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: MEDICAMENTO_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar medicamento elegido
export const delete_medicamento = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_MEDICAMENTO_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar medicamento elegido
export const edit_medicamento = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_MEDICAMENTO_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo medicamento
export const insert_medicamento = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_MEDICAMENTO_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN MEDICAMENTOS ////////////////////////////





//////////////////////////// INICIO MOTIVOS ALTA ////////////////////////////
// obtener listado de todos los motivos de alta registrados
export const get_motivosAlta = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: MOTIVOSALTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un motivo de alta en específico
export const get_motivoAlta = (info) => {
    // console.log("info:", info);
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: MOTIVOALTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar motivo de alta elegido
export const delete_motivoAlta = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_MOTIVOALTA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar motivo de alta elegido
export const edit_motivoAlta = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_MOTIVOALTA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo motivo de alta
export const insert_motivoAlta = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_MOTIVOALTA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN MOTIVOS ALTA ////////////////////////////





//////////////////////////// INICIO TERAPÉUTICAS ////////////////////////////
// obtener listado de todas las terapéuticas registradas
export const get_terapeuticas = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: TERAPEUTICAS_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// obtener información de un terapéutica en específico
export const get_terapeutica = (info) => {
    // console.log("info:", info
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: TERAPEUTICA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ info.token }`,
            },
            withCredentials: true,
            data: info,
        });
        // console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// eliminar terapéutica elegido
export const delete_terapeutica = (auth, info) => {
    try {
        const response = axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: DELETE_TERAPEUTICA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: {
                token: auth.token,
                id_usuario: info.id_usuario,
            },
        });
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}

// editar terapéutica elegido
export const edit_terapeutica = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: EDIT_TERAPEUTICA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}

// registrar nuevo terapéutica
export const insert_terapeutica = (auth, info) => {
    return axios({
        method: 'POST',
        baseUrl: BASE_URL,
        url: INSERT_TERAPEUTICA_URL,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-CSRFToken': cookies.get('csrftoken'),
            'Authorization' : `Bearer ${ auth.token }`,
        },
        withCredentials: true,
        data: info,
    }).then((response) => {
        return response
    }).catch(function(error){
        return error.response
    });
}
//////////////////////////// FIN TERAPÉUTICAS ////////////////////////////