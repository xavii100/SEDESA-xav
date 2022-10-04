import { createContext, useState } from "react";
import { useNavigate } from 'react-router-dom'

import Cookies from 'universal-cookie';
import axios from 'axios';

const AuthContext = createContext({});

const BASE_URL = 'http://132.248.51.138:8000';
// const BASE_URL = 'http://localhost:8000';
const LOGOUT_URL = '/users/logout/'
const LOGIN_URL = '/sedesa/autenticacion'

const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const cookies = new Cookies();

    const [auth, setAuth] = useState(  
        {
            // recuperar valores almacenados en la sesión actual
            token: sessionStorage.getItem('token') ? JSON.parse(sessionStorage.getItem('token')) : null,
            id_user: sessionStorage.getItem('id_user') ? JSON.parse(sessionStorage.getItem('id_user')) : null

        }
    );

    const logoutUser = async () => {
        axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: LOGOUT_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
                'Authorization' : `Bearer ${auth.token}`,
            },
            withCredentials: true,
        }).then((response) => {
            // console.log("response:", response)
            navigate(LOGIN_URL, {replace: true})
            // eliminar valores almacenados de las sesiones actuales            
            cookies.remove('csrftoken');
            sessionStorage.removeItem('id_user');
            sessionStorage.removeItem('token');
            setAuth(null);
        }).catch(function(error){
            console.log("error:", error.response)
            // return error.response
        });

        // try {
        //     const response = await axios.get(LOGOUT_URL);
        //     navigate(LOGIN_URL, {replace: true})
        //     // eliminar valores almacenados de las sesiones actuales            
        //     cookies.remove('csrftoken');
        //     sessionStorage.removeItem('id_user');
        //     sessionStorage.removeItem('token');
        //     setAuth(null);
        //     // window.location.reload();
        // } catch (error) {
        //     console.log(error?.response);
        //     console.log(error)
        // }
    }
    
    return (
        <AuthContext.Provider value={ { auth, setAuth, logoutUser } }>
            { children }
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };
