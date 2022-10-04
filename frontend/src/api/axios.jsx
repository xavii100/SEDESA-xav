import axios from "axios";
import Cookies from "universal-cookie";
import useAuth from "../hooks/useAuth";

//const BASE_URL = 'http://132.248.51.138:8000';
const BASE_URL = "http://127.0.0.1:8000";
const cookies = new Cookies();

function Get_current_token() {
  const { auth } = useAuth();
  console.log(auth);
  return auth.token;
}

export default axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": cookies.get("csrftoken"),
    Authorization: `Bearer ${Get_current_token}`,
  },
  withCredentials: true,
});

export const axiosLogin = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
