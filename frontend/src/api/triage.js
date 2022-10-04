import axios from "axios";
import Cookies from "universal-cookie";

const BASE_URL = "http://127.0.0.1:8000";
const FORM_URL = "/triage/get_carga_formulario/";
const INSERT_PACIENTE_URL = "/triage/set_crea_formulario/";
const cookies = new Cookies();

export const get_all_triage = (auth) => {
  try {
    const response = axios({
      method: "POST",
      url: FORM_URL,
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

export const set_paciente = (auth, datos) => {
  return axios({
    method: "POST",
    baseUrl: BASE_URL,
    url: INSERT_PACIENTE_URL,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": cookies.get("csrftoken"),
      Authorization: `Bearer ${auth.token}`,
    },
    withCredentials: true,
    data: datos,
  })
    .then((response) => {
      return response;
    })
    .catch(function (error) {
      return error.response;
    });
};