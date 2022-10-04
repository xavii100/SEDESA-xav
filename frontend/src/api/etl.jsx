import axios from "axios";
import Cookies from 'universal-cookie';

// endpoints de catálogos
// const BASE_URL = 'http://132.248.51.138:8000'; // http://localhost:8000
const BASE_URL = 'http://127.0.0.1:8000';
const cookies  = new Cookies();

const BITACORA_URL  = '/etl/get_bitacora/';

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


//////////////////////////// INICIO BITÁCORAS ////////////////////////////
// obtener listado de todas las bitacoras del ETL registradas
export const get_bitacora = (auth) => {
    try {
        const response = axios({
            method: 'POST',
            // baseUrl: BASE_URL,
            url: BITACORA_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${ auth.token }`,
            },
            withCredentials: true,
            data: { token: auth.token },
        });
        console.log(response);
        return response // devolver promise
    } catch (error) {
        console.log(error)
        console.log(error?.response)
    }
}
//////////////////////////// FIN BITÁCORAS ////////////////////////////