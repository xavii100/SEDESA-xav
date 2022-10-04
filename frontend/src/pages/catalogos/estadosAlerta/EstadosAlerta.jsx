import React, {useEffect, useState} from 'react'

import useAuth from "../../../hooks/useAuth";
import {get_estadosAlerta} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import EstadosAlertaDataTable from './EstadosAlertaDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../css/index.css'

const EstadosAlerta = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [estadosAlerta, setEstadosAlerta] = useState([]);

    // cargar todos los estados de alerta registrados
    useEffect(() => {
        const getEstadosAlerta = async () => {
            const { data } = await get_estadosAlerta(auth);
            // console.log(data);
            setEstadosAlerta( () => data.estado_alerta );
        }
        setLoading(true);
        getEstadosAlerta();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de estados de alerta registrados"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <EstadosAlertaDataTable estadosAlerta={estadosAlerta} setEstadosAlerta={setEstadosAlerta} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default EstadosAlerta;