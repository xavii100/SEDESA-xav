import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';

import { CenteredContainer, BorderedShadowContainer } from "./../../components/layout/Container";
import { SingleTitle } from "../../components/layout/Title";
import { ValidateInputForm, InputForm, LabelForm, SubmitButtonForm } from "./../../components/layout/Form";
import { LoginIcon } from "./../../components/layout/Icons";
import { DangerAlert } from "./../../components/layout/Alerts";

import useAuth from '../../hooks/useAuth';
import axios from 'axios';
import Cookies from 'universal-cookie';


const BASE_URL = 'http://132.248.51.138:8000';
// const BASE_URL = 'http://localhost:8000';
const LOGIN_URL = '/users/login/';

const FormularioLogin = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state ? location.state.from.pathname : "/sedesa/inicio"
    // --------------------------------------------------------------------------------
    // validar formulario
    const emailRef = useRef();
    const passwordRef = useRef();
    const errRef = useRef();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [emailHelp, setEmailHelp] = useState("");
    const [passwordHelp, setPasswordHelp] = useState("");
    const [colorEmail, setColorEmail] = useState('');
    const [colorPassword, setColorPassword] = useState('');
    // --------------------------------------------------------------------------------
    const cookies = new Cookies();

    // useEffect(() => {
    //     emailRef.current.focus();
    // }, []);

    useEffect(() => {
        setErrMsg('');
    }, [email, password]);

    const handleEmailChange = (e) => {
        const { value } = e.target;
        setEmail(value);
        if (value.trim() !== "" && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(value)) {
            setEmailHelp('');
            setColorEmail('green');
        } else {
            setEmailHelp('Escribe un correo electrónico válido!');
            setColorEmail('red');
        }
    }

    const handlePasswordChange = (e) => {
        const { value } = e.target;
        setPassword(value)
        if (value.trim() !== "") {
            setPasswordHelp('')
            setColorPassword('green')
        } else {
            setPasswordHelp('La constraseña no puede ser vacía!')
            setColorPassword('red')
        }
    }


    const handleLoginUser = async (e) => {
        e.preventDefault();

        if (email.trim() !== "" && /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(.\w{2,3})+$/.test(email)) {
            setEmailHelp('');
            setColorEmail('green');
        } else {
            setEmailHelp('Escribe un correo electrónico válido!');
            setColorEmail('red');
            emailRef.current.focus();
            return false;
        }

        if (password.trim() !== "") {
            setPasswordHelp('')
            setColorPassword('green')
        } else {
            setPasswordHelp('La constraseña no puede ser vacía!')
            setColorPassword('red')
            passwordRef.current.focus();
            return false
        }

        axios({
            method: 'POST',
            baseUrl: BASE_URL,
            url: LOGIN_URL,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken': cookies.get('csrftoken'),
            },
            withCredentials: true,
            data: { email, password },
        }).then((response) => {
            // console.log("response:", response)
            const token = response.data.token;
            const id_user = jwt_decode(token).usuario_id
            setAuth({ token, id_user });
            // almacenar token e id_user en sessiones
            sessionStorage.setItem("token", JSON.stringify(token));
            sessionStorage.setItem("id_user", JSON.stringify(id_user));
            setEmail('');
            setPassword('');
            setColorEmail('');
            setColorPassword('');
            navigate(from, { replace: true });
            // return response
        }).catch(function(error){
            if (error.response.status === 400) {
                setErrMsg(error.response.data.error);
            }
            // console.log("error:", error.response)
            // return error.response
        });
    };

    return(
        <>
            <CenteredContainer>
                <BorderedShadowContainer
                    className="sedesa-green"
                >
                    <SingleTitle>
                        Sistema de Información<br/>
                        Hospitalaria SEDESA
                    </SingleTitle>
                    <DangerAlert
                        innerRef={errRef}
                        text={errMsg}
                        className={ errMsg ? "show" : "hide" }
                    />
                    <form onSubmit={ handleLoginUser }>
                        <ValidateInputForm 
                            type="email"
                            id="email"
                            name="email"
                            label="Correo electrónico"
                            innerRef={ emailRef }
                            autoComplete="off"
                            placeholder="usuario@dominio.com"
                            onChange={ handleEmailChange }
                            value={ email }
                            color={ colorEmail }
                            helpMessage={ emailHelp }
                        />

                        <ValidateInputForm 
                            type="password"
                            id="password"
                            name="password"
                            label="Contraseña"
                            innerRef={ passwordRef }
                            autoComplete="off"
                            placeholder="escribe tu contraseña"
                            onChange={ handlePasswordChange }
                            value={ password }
                            color={ colorPassword }
                            helpMessage={ passwordHelp }
                        />
                        <span className="block mb-6 text-sm font-medium text-white-900 pt-2">
                            ¿Olvidaste tu contraseña?
                        </span>

                        <SubmitButtonForm>
                            <LoginIcon />
                            Entrar al sistema
                        </SubmitButtonForm>
                    </form>
                </BorderedShadowContainer>
            </CenteredContainer>
        </>
    );
};

export default FormularioLogin;
