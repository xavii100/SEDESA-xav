import axios from "axios";
import Cookies from "universal-cookie";

// endpoints de usuarios
// const BASE_URL = 'http://132.248.51.138:8000';
const BASE_URL = "http://127.0.0.1:8000";
const USER_URL = "/users/get_user/";
const USERS_URL = "/users/get_users/";
const INSERT_EDIT_USER_URL = "/users/set_user/";
const EDIT_USER_PROFILE_URL = "/users/set_profile/";
const DELETE_USER_URL = "/users/delete_user/";
const ACTIVE_USER_URL = "/users/active_user/";
const INSERT_EDIT_USER_ROLE_URL = "/users/set_role/";
const ROLES_URL = "/users/get_roles/";
const ROL_URL = "/users/get_rol/";
const cookies = new Cookies();

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": cookies.get("csrftoken"),
  Authorization: "",
};

// obtener información del usuario que se ha logeado
export const get_user = (info, logoutUser) => {
  HEADERS["Authorization"] = `Bearer ${info.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: USER_URL,
      headers: HEADERS,
      withCredentials: true,
      data: info,
    });
    // console.log(response);
    response.catch(function (error) {
      if (error.response.data?.error === "Token expirado") {
        logoutUser();
      }
      console.log(error.response.data); // mostrar el error
    });
    // response.then((response) => {
    //     return response // devolver promise
    // });
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// obtener un listado de todos los usuarios registrados
export const get_users = (auth) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: USERS_URL,
      headers: HEADERS,
      withCredentials: true,
      data: { token: auth.token },
    });
    // console.log(response);
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// registrar nuevo usuario
export const insert_user = (auth, info) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  return axios({
    method: "POST",
    baseUrl: BASE_URL,
    url: INSERT_EDIT_USER_URL,
    headers: HEADERS,
    withCredentials: true,
    data: info,
  })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};

// editar usuario elegido
export const edit_user = (auth, info) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  return axios({
    method: "POST",
    baseUrl: BASE_URL,
    url: INSERT_EDIT_USER_URL,
    headers: HEADERS,
    withCredentials: true,
    data: info,
  })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};

// activar desactivar usuario elegido
export const activate_user = (auth, info) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: ACTIVE_USER_URL,
      headers: HEADERS,
      withCredentials: true,
      data: {
        token: auth.token,
        id_usuario: info.id_usuario,
        activar: info.activar,
      },
    });
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// eliminar usuario elegido
export const delete_user = (auth, info) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: DELETE_USER_URL,
      headers: HEADERS,
      withCredentials: true,
      data: {
        token: auth.token,
        id_usuario: info.id_usuario,
      },
    });
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// registrar nuevo rol de usuario con permisos
export const insert_user_role = (auth, info_rol) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  // console.log("info_rol:", info_rol)
  return axios({
    method: "POST",
    baseUrl: BASE_URL,
    url: INSERT_EDIT_USER_ROLE_URL,
    headers: HEADERS,
    withCredentials: true,
    data: info_rol,
  })
    .then((response) => {
      // console.log(response)
      return response;
    })
    .catch(function (error) {
      console.log(error.response);
      return error.response;
    });
};

// obtener toda la información de un rol por su id
export const get_rol = (auth, id_rol) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: ROL_URL,
      headers: HEADERS,
      withCredentials: true,
      data: {
        token: auth.token,
        id_rol: id_rol,
      },
    });
    // console.log(response);
    return response; // devolver promise
  } catch (error) {
    console.log(error);
    console.log(error?.response);
  }
};

// obtener un listado de todos los roles de usuario registrados
export const get_roles = auth => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: ROLES_URL,
      headers: HEADERS,
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

// editar perfil del usuario (su propia información)
export const edit_user_profile = (auth, info) => {
  HEADERS["Authorization"] = `Bearer ${auth.token}`;
  return axios({
    method: "POST",
    baseUrl: BASE_URL,
    url: EDIT_USER_PROFILE_URL,
    headers: HEADERS,
    withCredentials: true,
    data: info,
  })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};