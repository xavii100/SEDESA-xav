import axios from "axios";
import Cookies from "universal-cookie";

// endpoints de usuarios
//const BASE_URL = 'http://132.248.51.138:8000';
const BASE_URL = "http://127.0.0.1:8000";
const HOSPITALS_URL = "/catalogos/get_hospitales/";
const ROLES_URL = "/users/get_roles/";
const PERMISSIONS_URL = "/users/get_permisos/";
const cookies = new Cookies();

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": cookies.get("csrftoken"),
  Authorization: "",
};

// obtener un listado de todos los roles de usuario registrados
export const get_roles = auth => {
  headers["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: ROLES_URL,
      headers: headers,
      withCredentials: true,
      data: {token: auth.token},
    });
    // console.log(response);
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// obtener un listado de todos los permisos registrados
export const get_permissions = auth => {
  headers["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: PERMISSIONS_URL,
      headers: headers,
      withCredentials: true,
      data: {token: auth.token},
    });
    // console.log(response);
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// obtener un listado de todos los hospitales registrados
export const get_hospitals = auth => {
  headers["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: HOSPITALS_URL,
      headers: headers,
      withCredentials: true,
      data: {token: auth.token},
    });
    // console.log(response);
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};
