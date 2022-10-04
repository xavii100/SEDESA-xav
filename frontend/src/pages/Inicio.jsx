import React, {useContext, useEffect, useState} from 'react'
import { AuthContext } from '../context/AuthContext'

import axios from "../api/axios";
import useAuth from "../hooks/useAuth";

import { MainContainer, RowsContainer, ColumnContainer } from "../components/layout/Container";
import { Title } from "../components/layout/Title";

const USERS_URL = '/users/get_user/';

const Inicio = () => {
    const { auth } = useAuth();
    const [user, setUser] = useState([]);

    // cargar todos los usuarios registrados
    // useEffect(() => {
    //     const get_user = async () => {
    //         try {
    //             const response = await axios.post(USERS_URL, JSON.stringify(auth));
    //             setUser(response.data.data);
    //         } catch (error) {
    //             console.error(error.response);
    //         }
    //     }
    //     get_user();
    // }, []);

    return (
    <>
        <MainContainer>
            <Title 
                textAlign="left"
                title="SI-SEDESA"
            />
            <RowsContainer cols="1" columnsGap="4">
                <ColumnContainer>
                    {/* <p>
                        Bienvenido <span className='font-medium'>{user.nombre_completo}</span> al Sistema de Información Hospitalaria - SEDESA
                    </p>
                    <p>
                        Adscripción <span className='font-medium'>{user.hospital}</span>
                    </p> */}
                </ColumnContainer>
            </RowsContainer>
        </MainContainer>
    </>
)
}

export default Inicio