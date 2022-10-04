import React, {useEffect, useState} from 'react'
// import axios from "axios";

import useAuth from "../../../hooks/useAuth";
import {get_terapeuticas} from '../../../api/catalogos';

import { MainContainer } from "../../../components/layout/Container";
import { Title } from "../../../components/layout/Title";
import TerapeuticasDataTable from './TerapeuticasDataTable';
import Loading from '../../../components/layout/Loading';

// import '../../../css/index.css'

const Terapeuticas = () => {
    const { auth } = useAuth();
    const [loading, setLoading] = useState(false);
    const [terapeuticas, setTerapeuticas] = useState([]);

    // cargar todas las terapéuticas registradas
    useEffect(() => {
        const getTerapeuticas = async () => {
            const { data } = await get_terapeuticas(auth);
            setTerapeuticas( () => data.terapeuticas );
        }
        setLoading(true);
        getTerapeuticas();
        setLoading(false);
    }, []);
    
    return (
        <>
            <MainContainer>
                <Title
                    textAlign="left"
                    title="Lista de terapéuticas registradas"
                />
                <div className='grid grid-cols-1 gap-6 md:grid-cols-1 lg:grid-cols-1'>
                    <div>
                        { loading ? <Loading /> : <TerapeuticasDataTable terapeuticas={terapeuticas} setTerapeuticas={setTerapeuticas} /> }
                    </div>
                </div>    
            </MainContainer>
        </>
    );
};


export default Terapeuticas;