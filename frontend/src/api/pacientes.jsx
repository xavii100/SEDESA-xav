import axios from "axios";
import Cookies from "universal-cookie";

// endpoints de usuarios
const BASE_URL = 'http://132.248.51.138:8000';
// const BASE_URL = "http://127.0.0.1:8000";
const PACIENTE_URL = "/triage/get_paciente/";
const PACIENTES_URL = "/triage/get_pacientes/";
const cookies = new Cookies();

const HEADERS = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "X-CSRFToken": cookies.get("csrftoken"),
  Authorization: "",
};

// obtener información del usuario que se ha logeado
export const get_paciente = (info, logoutUser) => {
  HEADERS["Authorization"] = `Bearer ${info.token}`;
  try {
    const response = axios({
      method: "POST",
      baseUrl: BASE_URL,
      url: PACIENTE_URL,
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
export const get_pacientes = (auth) => {
    /*
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
  */
  try {
    const response = axios({
      method: "POST",
      url: PACIENTES_URL,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
        Authorization: `Bearer ${auth.token}`,
      },
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
